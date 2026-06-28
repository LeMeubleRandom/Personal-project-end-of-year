import GameManager from "../script/GameManager.js";
import crypto from "crypto";

import User from "../model/User.js";
import Game from "../model/Game.js";
import GameService from "../service/GameService.js";

async function validateDeck(deckId, userId) {
  const deck = await User.getDeck(deckId);
  if (!deck) {
    return { isValid: false, message: "Deck introuvable." };
  }

  let cardList = [];
  try {
    cardList =
      typeof deck.cardList === "string"
        ? JSON.parse(deck.cardList)
        : deck.cardList;
  } catch (e) {
    return { isValid: false, message: "Structure de deck invalide." };
  }

  if (!Array.isArray(cardList)) {
    return { isValid: false, message: "Structure de deck invalide." };
  }

  if (cardList.length !== 30) {
    return {
      isValid: false,
      message: `Votre deck doit contenir exactement 30 cartes (actuellement: ${cardList.length}).`,
    };
  }

  const collection = await User.getCollection(userId);
  if (!collection) {
    return { isValid: false, message: "Collection utilisateur introuvable." };
  }

  let cardCollection = [];
  let quantity = [];
  try {
    cardCollection =
      typeof collection.cardCollection === "string"
        ? JSON.parse(collection.cardCollection)
        : collection.cardCollection || [];
    quantity =
      typeof collection.quantity === "string"
        ? JSON.parse(collection.quantity)
        : collection.quantity || [];
  } catch (e) {
    return {
      isValid: false,
      message: "Erreur lors de la lecture de votre collection.",
    };
  }

  const ownedMap = {};
  cardCollection.forEach((cardId, index) => {
    ownedMap[cardId] = quantity[index] || 0;
  });

  const deckCounts = {};
  cardList.forEach((cardId) => {
    deckCounts[cardId] = (deckCounts[cardId] || 0) + 1;
  });

  for (const cardId of Object.keys(deckCounts)) {
    const required = deckCounts[cardId];
    const has = ownedMap[cardId] || 0;
    if (has < required) {
      return {
        isValid: false,
        message:
          "Certaines cartes de votre deck ne figurent pas dans votre collection.",
      };
    }
  }

  return { isValid: true };
}

export default class GameController {
  static async host(req, res) {
    try {
      const gameId = Math.floor(100000 + Math.random() * 900000);
      const { userId, activeDeck } = req.body;

      if (activeDeck === undefined || activeDeck === null) {
        return res.status(400).json({
          status: "error",
          message:
            "Vous devez sélectionner un deck actif dans l'onglet 'Mes Decks' avant de pouvoir créer une partie.",
        });
      }

      const validation = await validateDeck(activeDeck, userId);
      if (!validation.isValid) {
        return res.status(400).json({
          status: "error",
          message: validation.message,
        });
      }

      const hostedGame = await Game.createGame(gameId, userId, activeDeck);
      await User.setGameId(userId, gameId);
      await User.setInGame(userId, true);

      res.status(200).json(hostedGame);
    } catch (error) {
      console.error("Error creatingGame:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  static async join(req, res) {
    try {
      const { userId, activeDeck, gameId } = req.body;

      if (activeDeck === undefined || activeDeck === null) {
        return res.status(400).json({
          status: "error",
          message:
            "Vous devez sélectionner un deck actif dans l'onglet 'Mes Decks' avant de pouvoir rejoindre une partie.",
        });
      }

      const validation = await validateDeck(activeDeck, userId);
      if (!validation.isValid) {
        return res.status(400).json({
          status: "error",
          message: validation.message,
        });
      }

      const gameRow = await Game.findById(gameId);
      if (!gameRow) {
        return res.status(404).json({
          status: "error",
          message: "Salon de jeu introuvable.",
        });
      }

      if (gameRow.player1Id && gameRow.player2Id) {
        return res.status(400).json({
          status: "error",
          message: "Ce salon est déjà complet (2 joueurs maximum).",
        });
      }

      if (gameRow.isStarted === 1) {
        return res.status(400).json({
          status: "error",
          message: "La partie a déjà commencé dans ce salon.",
        });
      }

      const checkPlayer = await GameService.checkPlayer(userId, gameId);
      if (!checkPlayer)
        return res.status(400).json({
          status: "error",
          message: "Utilisateur déjà présent dans la session",
        });

      const joinedGame = await Game.joinGame(gameId, userId, activeDeck);
      await User.setGameId(userId, gameId);
      await User.setInGame(userId, true);

      res.status(200).json(joinedGame);
    } catch (error) {
      console.error("Error joiningGame:", error);
      res
        .status(500)
        .json({ status: "error", message: error.message, stack: error.stack });
    }
  }

  static async getAllLobby(req, res) {
    try {
      const lobbys = await Game.getAllLobby();
      res.status(200).json(lobbys);
    } catch (error) {
      console.error("Error getLobbys  :", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  static async getLobby(req, res) {
    try {
      const gameId = req.params.gameId;
      const lobby = await Game.findById(gameId);
      res.status(200).json(lobby);
    } catch (error) {
      console.error("Error getLobby  :", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  static async startGame(req, res) {
    try {
      const { gameId } = req.body;

      const gameRow = await Game.findById(gameId);
      if (!gameRow) {
        return res
          .status(404)
          .json({ status: "error", message: "Salon introuvable." });
      }

      if (!gameRow.player2Id) {
        return res.status(400).json({
          status: "error",
          message: "Il manque un adversaire pour lancer la partie.",
        });
      }

      const player1Data = {
        id: gameRow.player1Id,
        name: gameRow.player1Name,
        activeDeck: gameRow.player1DeckId,
      };
      const player2Data = {
        id: gameRow.player2Id,
        name: gameRow.player2Name,
        activeDeck: gameRow.player2DeckId,
      };

      await Game.startGame(gameId);
      gameRow.isStarted = 1;
      const runningGame = await GameManager.startGame(
        Number(gameId),
        player1Data,
        player2Data,
        gameRow,
      );

      const p1Hand = runningGame.players.p1.hand.map((c) => c.id);
      const p2Hand = runningGame.players.p2.hand.map((c) => c.id);
      const p1DeckOrder = runningGame.players.p1.deck.map((c) => c.id);
      const p2DeckOrder = runningGame.players.p2.deck.map((c) => c.id);

      await Game.updateGameState(
        gameId,
        p1Hand,
        p2Hand,
        p1DeckOrder,
        p2DeckOrder,
      );

      res.status(200).json({ status: "success", message: "Partie lancée !" });
    } catch (error) {
      console.error("Error startGame:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  static async leaveGame(req, res) {
    try {
      const { userId, gameId } = req.body;

      await User.setGameId(userId, null);
      await User.setInGame(userId, false);

      const gameDetails = await Game.findById(gameId);
      if (gameDetails) {
        if (Number(gameDetails.player1Id) === Number(userId)) {
          if (gameDetails.player2Id) {
            await User.setGameId(gameDetails.player2Id, null);
            await User.setInGame(gameDetails.player2Id, false);
          }
          await Game.deleteGame(gameId);
          GameManager.endGame(Number(gameId));
        } else {
          await Game.removePlayer2(gameId);
        }
      }

      res.status(200).json({ status: "success", message: "Salon quitté." });
    } catch (error) {
      console.error("Error leaveGame:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  static async getGameStart(req, res) {
    try {
      const userId = req.userId;
      const user = await User.findById(userId);
      if (!user || !user.gameId) {
        return res.status(400).json({
          status: "error",
          message: "Vous n'êtes pas dans une partie.",
        });
      }

      const game = GameManager.getGame(Number(user.gameId));
      if (!game) {
        return res.status(404).json({
          status: "error",
          message: "Partie introuvable dans la mémoire du serveur.",
        });
      }

      res.status(200).json({ status: "success", game });
    } catch (error) {
      console.error("Error getGameStart:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }
}

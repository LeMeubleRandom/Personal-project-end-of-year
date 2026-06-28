import Game from "./scriptModel/Game.js";
import GameModel from "../model/Game.js";

class GameManager {
  constructor() {
    this.games = new Map();
  }

  async startGame(gameId, player1Data, player2Data, lobbyData = {}) {
    if (this.games.has(gameId)) {
      throw new Error("Une partie avec cet ID existe déjà.");
    }

    const newGame = new Game(gameId, player1Data, player2Data, lobbyData);
    await newGame.start();
    this.games.set(gameId, newGame);
    return newGame;
  }

  getGame(gameId) {
    return this.games.get(gameId);
  }

  endGame(gameId) {
    this.games.delete(gameId);
    console.log(`Partie ${gameId} terminée et supprimée de la mémoire.`);
  }

  async handlePlayerAction(gameId, playerId, actionType, payload) {
    const game = this.getGame(gameId);
    if (!game) return { error: "Partie introuvable" };

    const activePlayerKey = game.playerTurn;
    const activePlayer = game.players[activePlayerKey];

    if (Number(activePlayer.id) !== Number(playerId)) {
      return { error: "Ce n'est pas votre tour !" };
    }

    switch (actionType) {
      case "CHANGE_PHASE":
        await game.nextTurnPhase(payload.requestedPhase);
        break;
      case "SUMMON_BEING": {
        if (game.phase !== "MainPhase1") {
          return {
            error:
              "Vous ne pouvez invoquer des êtres que durant la Main Phase.",
          };
        }
        const { cardHandIndex } = payload;
        const card = activePlayer.hand[cardHandIndex];
        if (!card) return { error: "Carte introuvable en main." };

        // Validation pour l'effet de Nyxos
        if (card.id === 1 || card.name?.toLowerCase().includes("nyxos")) {
          const { discardCardHandIndex, targetGraveyardCardId } = payload;
          if (discardCardHandIndex === undefined || discardCardHandIndex === null || targetGraveyardCardId === undefined || targetGraveyardCardId === null) {
            return {
              error: "Effet de Nyxos : vous devez sélectionner une carte à défausser et un Être du cimetière à réinvoquer.",
            };
          }
          const discardIdx = Number(discardCardHandIndex);
          if (discardIdx < 0 || discardIdx >= activePlayer.hand.length || discardIdx === Number(cardHandIndex)) {
            return { error: "Sélection de la carte à défausser invalide." };
          }
          const hasBeingInGraveyard = activePlayer.graveyard.some(
            (c) => c.id === Number(targetGraveyardCardId) && c.type === "Être"
          );
          if (!hasBeingInGraveyard) {
            return { error: "La carte du cimetière sélectionnée n'est pas un Être valide." };
          }
        }

        const success = activePlayer.summonBeing(cardHandIndex);
        if (!success) {
          return {
            error:
              "Invocation impossible (compteurs d'accélérateur insuffisants ou zone pleine).",
          };
        }

        // Exécution de l'effet de Nyxos
        if (card.id === 1 || card.name?.toLowerCase().includes("nyxos")) {
          try {
            const nyxosEffect = await import("./cardScript/nyxos.js");
            await nyxosEffect.default(game, activePlayer, payload);
          } catch (err) {
            console.error("Erreur lors de l'effet de Nyxos:", err);
            return { error: err.message || "Erreur lors de l'exécution de l'effet de Nyxos." };
          }
        }
        break;
      }
      case "USE_ACCELERATOR": {
        if (game.phase !== "MainPhase1") {
          return {
            error:
              "Vous ne pouvez charger des accélérateurs que durant la Main Phase.",
          };
        }
        const { cardHandIndex } = payload;
        const success = activePlayer.useAsAccelerator(cardHandIndex);
        if (!success) {
          return {
            error: "Impossible d'utiliser cette carte comme accélérateur.",
          };
        }
        break;
      }
      case "PLAY_SUPPORT": {
        if (game.phase !== "MainPhase1") {
          return {
            error:
              "Vous ne pouvez jouer des cartes soutiens/sorts que durant la Main Phase.",
          };
        }
        const { cardHandIndex } = payload;
        const card = activePlayer.hand[cardHandIndex];
        if (!card) return { error: "Carte introuvable en main." };

        // Validation pour l'effet de Réincarnation de monstre
        if (card.id === 62 || card.name?.toLowerCase() === "réincarnation de monstre") {
          const { targetGraveyardCardId } = payload;
          if (targetGraveyardCardId === undefined || targetGraveyardCardId === null) {
            return { error: "Effet de Réincarnation : vous devez sélectionner un Être du cimetière à réinvoquer." };
          }
          const hasBeingInGraveyard = activePlayer.graveyard.some(
            (c) => c.id === Number(targetGraveyardCardId) && c.type === "Être"
          );
          if (!hasBeingInGraveyard) {
            return { error: "La carte sélectionnée n'est pas un Être valide dans votre cimetière." };
          }
        }

        const success = activePlayer.playSupport(cardHandIndex);
        if (!success) {
          return {
            error:
              "Impossible de jouer ce soutien (compteurs d'accélérateur insuffisants ou zone pleine).",
          };
        }

        // Exécution des effets de Sorts
        if (card.id === 61 || card.name?.toLowerCase() === "pot of greed") {
          try {
            const potOfGreedEffect = await import("./cardScript/potOfGreed.js");
            await potOfGreedEffect.default(game, activePlayer, payload);
          } catch (err) {
            console.error("Erreur lors de l'effet de Pot of Greed:", err);
            return { error: err.message || "Erreur lors de l'exécution de l'effet de Pot of Greed." };
          }
        } else if (card.id === 62 || card.name?.toLowerCase() === "réincarnation de monstre") {
          try {
            const monsterReincarnationEffect = await import("./cardScript/monsterReincarnation.js");
            await monsterReincarnationEffect.default(game, activePlayer, payload);
          } catch (err) {
            console.error("Erreur lors de l'effet de Réincarnation:", err);
            return { error: err.message || "Erreur lors de l'exécution de l'effet de Réincarnation." };
          }
        }
        break;
      }
      case "ATTACK": {
        if (game.phase !== "BattlePhase") {
          return {
            error: "Vous ne pouvez attaquer que durant la Battle Phase.",
          };
        }
        const { attackerIndex, targetIndex } = payload;
        await game.resolveAttack(attackerIndex, targetIndex);
        break;
      }
      case "SURRENDER": {
        const playerKey =
          Number(game.players.p1.id) === Number(playerId) ? "p1" : "p2";
        game.players[playerKey].pv = 0;
        game.players[playerKey].surrend = true;
        console.log(`${game.players[playerKey].name} a abandonné la partie.`);
        break;
      }
      default:
        return { error: "Action inconnue" };
    }

    const p1Hand = game.players.p1.hand.map((c) => c.id);
    const p2Hand = game.players.p2.hand.map((c) => c.id);
    const p1DeckOrder = game.players.p1.deck.map((c) => c.id);
    const p2DeckOrder = game.players.p2.deck.map((c) => c.id);
    await GameModel.updateGameState(
      gameId,
      p1Hand,
      p2Hand,
      p1DeckOrder,
      p2DeckOrder,
    );

    const gameOverStatus = game.checkGameOver();
    if (gameOverStatus) {
      const winnerId = game.players[gameOverStatus.winner].id;
      const loserId = game.players[gameOverStatus.loser].id;
      const hasSurrend = game.players[gameOverStatus.loser].surrend;

      await GameModel.endGameAndDistributeRewards(
        gameId,
        winnerId,
        loserId,
        hasSurrend,
      );

      this.endGame(gameId);
    }

    return { success: true, gameState: game };
  }
}

export default new GameManager();

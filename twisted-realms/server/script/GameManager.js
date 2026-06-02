import Game from "./scriptModel/Game.js";

class GameManager {
  constructor() {
    this.games = new Map();
  }

  async startGame(gameId, player1Data, player2Data) {
    if (this.games.has(gameId)) {
      throw new Error("Une partie avec cet ID existe déjà.");
    }

    const newGame = new Game(gameId, player1Data, player2Data);
    this.games.set(gameId, newGame);

    await newGame.start();
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

    if (game.playerTurn !== playerId) {
      return { error: "Ce n'est pas votre tour !" };
    }

    switch (actionType) {
      case "CHANGE_PHASE":
        await game.nextTurnPhase(payload.requestedPhase);
        break;
      default:
        return { error: "Action inconnue" };
    }
    return { success: true, gameState: game };
  }
}

export default new GameManager();

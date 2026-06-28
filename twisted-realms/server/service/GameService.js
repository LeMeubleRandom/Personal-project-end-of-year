import Game from "../model/Game.js";
import User from "../model/User.js";

class GameService {
  static async checkPlayer(userId, gameId) {
    const players = await Game.getPlayers(gameId);
    return !players.some((id) => Number(id) === Number(userId));
  }
}

export default GameService;

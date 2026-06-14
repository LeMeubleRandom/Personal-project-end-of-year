// model/Game.js
import pool from "../db/mysql.js";

export default class Game {
  static async createGame(gameId, userId, userName) {
    const [game] = await pool.execute(
      "INSERT INTO game (gameId, player1Id, player1) VALUES (?, ?, ?)",
      [gameId, userId, userName],
    );
    return game;
  }

  static async joinGame() {
    const [game];
    return game;
  }
}

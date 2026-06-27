// model/Game.js
import pool from "../db/mysql.js";

export default class Game {
  static async createGame(gameId, userId, activeDeck) {
    const [result] = await pool.execute(
      "INSERT INTO game (gameId, player1Id, player1DeckId, createDate, adminId) VALUES (?, ?, ?, UTC_TIMESTAMP(), ?)",
      [gameId, userId, activeDeck, userId],
    );
    return result;
  }

  static async joinGame(gameId, userId, activeDeck) {
    const [result] = await pool.execute(
      "UPDATE game SET player2Id = ?, player2DeckId = ? WHERE gameId = ?",
      [userId, activeDeck, gameId],
    );
    return result;
  }

  static async getLobbys() {
    const [lobbys] = await pool.execute(`
      SELECT g.*, u.name AS player1Name
      FROM game g
      LEFT JOIN user u ON g.player1Id = u.id
      ORDER BY g.createDate ASC
    `);
    return lobbys;
  }

  static async getPlayers(gameId) {
    const [[gameRow]] = await pool.execute(
      "SELECT player1Id, player2Id FROM game WHERE gameId = ?",
      [gameId],
    );
    if (!gameRow) return [];

    const players = [];
    if (gameRow.player1Id !== null && gameRow.player1Id !== undefined) {
      players.push(gameRow.player1Id);
    }
    if (gameRow.player2Id !== null && gameRow.player2Id !== undefined) {
      players.push(gameRow.player2Id);
    }
    return players;
  }
}

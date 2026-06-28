// model/Game.js
import pool from "../db/mysql.js";

export default class Game {
  static async createGame(gameId, userId, activeDeck) {
    const [result] = await pool.execute(
      "INSERT INTO game (gameId, player1Id, player1DeckId, createDate, adminId, player1Hand, player2Hand) VALUES (?, ?, ?, UTC_TIMESTAMP(), ?, '[]', '[]')",
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

  static async updateGameState(
    gameId,
    p1Hand,
    p2Hand,
    p1DeckOrder,
    p2DeckOrder,
  ) {
    const [result] = await pool.execute(
      "UPDATE game SET player1Hand = ?, player2Hand = ?, player1DeckOrder = ?, player2DeckOrder = ? WHERE gameId = ?",
      [
        JSON.stringify(p1Hand),
        JSON.stringify(p2Hand),
        JSON.stringify(p1DeckOrder),
        JSON.stringify(p2DeckOrder),
        gameId,
      ],
    );
    return result;
  }

  static async getAllLobby() {
    const [lobbys] = await pool.execute(`
      SELECT g.*, u.name AS player1Name
      FROM game g
      LEFT JOIN user u ON g.player1Id = u.id
      ORDER BY g.createDate ASC
    `);
    return lobbys;
  }

  static async findById(gameId) {
    const [[gameRow]] = await pool.execute(
      `
      SELECT g.*, u1.name AS player1Name, u1.userImage AS player1Image, u2.name AS player2Name, u2.userImage AS player2Image
      FROM game g
      LEFT JOIN user u1 ON g.player1Id = u1.id
      LEFT JOIN user u2 ON g.player2Id = u2.id
      WHERE g.gameId = ?
    `,
      [gameId],
    );
    return gameRow;
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

  static async startGame(gameId) {
    const [result] = await pool.execute(
      "UPDATE game SET isStarted = 1 WHERE gameId = ?",
      [gameId],
    );
    return result;
  }

  static async deleteGame(gameId) {
    const [result] = await pool.execute("DELETE FROM game WHERE gameId = ?", [
      gameId,
    ]);
    return result;
  }

  static async removePlayer2(gameId) {
    const [result] = await pool.execute(
      "UPDATE game SET player2Id = NULL, player2DeckId = NULL WHERE gameId = ?",
      [gameId],
    );
    return result;
  }

  static async endGameAndDistributeRewards(
    gameId,
    winnerId,
    loserId,
    hasSurrend,
  ) {
    if (winnerId) {
      await pool.execute(
        "UPDATE user SET credits = credits + 100, inGame = 0, gameId = NULL WHERE id = ?",
        [winnerId],
      );
    }
    if (loserId) {
      if (!hasSurrend) {
        await pool.execute(
          "UPDATE user SET credits = credits + 20, inGame = 0, gameId = NULL WHERE id = ?",
          [loserId],
        );
      } else {
        await pool.execute(
          "UPDATE user SET inGame = 0, gameId = NULL WHERE id = ?",
          [loserId],
        );
      }
    }
    await pool.execute("DELETE FROM game WHERE gameId = ?", [gameId]);
  }
}

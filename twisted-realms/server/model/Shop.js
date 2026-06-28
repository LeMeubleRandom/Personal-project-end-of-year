// model/Shop.js
import pool from "../db/mysql.js";

export default class Shop {
  static async getItems() {
    const [[decks], [packs]] = await Promise.all([
      pool.execute("SELECT *, 'deck' as type FROM structureDeck"),
      pool.execute("SELECT *, 'pack' as type FROM cardPack"),
    ]);

    return {
      decks,
      packs,
    };
  }

  static async findItemByIdType(id, type) {
    const table = type === "deck" ? "structureDeck" : "cardPack";

    const [rows] = await pool.execute(
      `SELECT *, ? as type FROM ${table} WHERE id = ?`,
      [type, id],
    );
    return rows.length > 0 ? rows[0] : null;
  }
}

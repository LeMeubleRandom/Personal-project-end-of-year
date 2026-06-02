// model/Card.js
import pool from "../db/mysql.js";

export default class Card {
  static async getAllCards() {
    const [cards] = await pool.execute(
      "SELECT * FROM card c ORDER BY c.faction ASC",
    );
    return cards;
  }

  static async getCardsByDeck(cardList) {
    if (!cardList || cardList.length === 0) return [];

    const uniqueIds = [...new Set(cardList)];
    const [cards] = await pool.query("SELECT * FROM card WHERE id IN (?)", [
      uniqueIds,
    ]);

    return cardList
      .map((id) => cards.find((card) => card.id === id))
      .filter(Boolean);
  }
}

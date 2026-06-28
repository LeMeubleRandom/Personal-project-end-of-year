// model/User.js
import pool from "../db/mysql.js";

export default class User {
  static async createUser(name, email, password, image, role = "user") {
    const [result] = await pool.execute(
      "INSERT INTO user (name, email, password, userImage, role, createdAt) VALUES (?, ?, ?, ?, ?, UTC_TIMESTAMP())",
      [name, email, password, image, role],
    );
    return result;
  }

  static async deleteUser(userId) {
    await pool.execute("DELETE FROM deck WHERE userId = ?", [userId]);
    await pool.execute("DELETE FROM userCollection WHERE userId = ?", [userId]);
    const [result] = await pool.execute("DELETE FROM user WHERE id = ?", [
      userId,
    ]);
    return result;
  }

  static async getAllUser() {
    const [rows] = await pool.execute(`
            SELECT u.id, u.name
            FROM user u
            ORDER BY u.name ASC
        `);
    return rows;
  }

  static async findByEmail(email) {
    const [[user]] = await pool.execute("SELECT * FROM user WHERE email = ?", [
      email,
    ]);
    return user;
  }

  static async findByName(name) {
    const [[user]] = await pool.execute("SELECT * FROM user WHERE name = ?", [
      name,
    ]);
    return user;
  }

  static async findById(userId) {
    const [[user]] = await pool.execute("SELECT * FROM user WHERE id = ?", [
      userId,
    ]);
    return user;
  }

  static async updateUserProfile(name, userImage, userId) {
    const [user] = await pool.execute(
      "UPDATE user SET name = ?, userImage = ? WHERE id = ?",
      [name, userImage, userId],
    );
    return user;
  }

  static async updateUserEmail(email, userId) {
    const [user] = await pool.execute(
      "UPDATE user SET email = ? WHERE id = ?",
      [email, userId],
    );
    return user;
  }

  static async findDecksByUserId(userId) {
    const [decks] = await pool.execute("SELECT * FROM deck WHERE userId = ?", [
      userId,
    ]);
    return decks;
  }

  static async createCollection(userId) {
    const [collection] = await pool.execute(
      "INSERT INTO userCollection (userId) VALUES (?)",
      [userId],
    );
    return collection;
  }

  static async createDeck(userId, name) {
    const [deck] = await pool.execute(
      "INSERT INTO deck (userId, name, postDate) VALUES (?, ?, UTC_TIMESTAMP())",
      [userId, name],
    );
    return deck;
  }

  static async updateDeck(id, name, cardList, mainCard) {
    const [deck] = await pool.execute(
      "UPDATE deck SET name = ?, cardList = ?, mainCard = ? WHERE id = ?",
      [name, cardList, mainCard, id],
    );
    return deck;
  }

  static async getDeck(id) {
    const [[deck]] = await pool.execute("SELECT * FROM deck WHERE id = ?", [
      id,
    ]);
    return deck;
  }

  static async deleteDeck(id) {
    const [deck] = await pool.execute("DELETE FROM deck WHERE id = ?", [id]);
  }

  static async getCollection(id) {
    const [[collection]] = await pool.execute(
      "SELECT * FROM userCollection WHERE userId = ?",
      [id],
    );
    return collection;
  }

  static async buyItem(user, price) {
    const updatedCredits = user.credits - price;
    const [updatedUser] = await pool.execute(
      "UPDATE user SET credits = ? WHERE id = ?",
      [updatedCredits, user.id],
    );
    return updatedUser;
  }

  static async addDeckToUser(userId, name, cardList, mainCardId) {
    const [result] = await pool.execute(
      "INSERT INTO deck (userId, name, cardList, mainCard, postDate) VALUES (?, ?, ?, ?, UTC_TIMESTAMP())",
      [userId, name, JSON.stringify(cardList), mainCardId],
    );
    return result;
  }

  static async addCardsToCollection(userId, cardIds) {
    let collection = await this.getCollection(userId);
    if (!collection) {
      await this.createCollection(userId);
      collection = await this.getCollection(userId);
    }

    let cardCollection = collection.cardCollection || [];
    if (typeof cardCollection === "string")
      cardCollection = JSON.parse(cardCollection);

    let quantity = collection.quantity || [];
    if (typeof quantity === "string") quantity = JSON.parse(quantity);

    for (const cardId of cardIds) {
      const index = cardCollection.indexOf(cardId);
      if (index !== -1) {
        quantity[index] = (quantity[index] || 0) + 1;
      } else {
        cardCollection.push(cardId);
        quantity.push(1);
      }
    }

    const [result] = await pool.execute(
      "UPDATE userCollection SET cardCollection = ?, quantity = ? WHERE userId = ?",
      [JSON.stringify(cardCollection), JSON.stringify(quantity), userId],
    );
    return result;
  }

  static async activateDeck(id, deckId) {
    const [user] = await pool.execute(
      "UPDATE user SET activeDeck = ? WHERE id = ?",
      [deckId, id],
    );
    return user;
  }

  static async setGameId(id, gameId) {
    const [user] = await pool.execute(
      "UPDATE user SET gameId = ? WHERE id = ?",
      [gameId, id],
    );
    return user;
  }

  static async setInGame(id, inGame) {
    const [user] = await pool.execute(
      "UPDATE user SET inGame = ? WHERE id = ?",
      [inGame, id],
    );
    return user;
  }

  static async toggleFavorite(userId, cardId) {
    let collection = await this.getCollection(userId);
    if (!collection) {
      await pool.execute(
        "INSERT INTO userCollection (userId, cardCollection, quantity, favorite) VALUES (?, '[]', '[]', '[]')",
        [userId],
      );
      collection = await this.getCollection(userId);
    }

    let favorite = collection.favorite || [];
    if (typeof favorite === "string") {
      favorite = JSON.parse(favorite);
    }

    const index = favorite.indexOf(cardId);
    if (index !== -1) {
      favorite.splice(index, 1);
    } else {
      favorite.push(cardId);
    }

    await pool.execute(
      "UPDATE userCollection SET favorite = ? WHERE userId = ?",
      [JSON.stringify(favorite), userId],
    );
    return favorite;
  }

  static async updateGlobalChat(isGlobalChat, userId) {
    const [result] = await pool.execute(
      "UPDATE user SET isGlobalChat = ? WHERE id = ?",
      [isGlobalChat, userId],
    );
    return result;
  }
}

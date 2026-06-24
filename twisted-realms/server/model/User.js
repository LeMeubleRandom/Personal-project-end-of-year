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
}

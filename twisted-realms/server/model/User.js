// model/User.js
import pool from "../db/mysql.js";

class User {
  static async createUser(name, email, password, role = "user") {
    const [result] = await pool.execute(
      "INSERT INTO user (name, email, password, role, date) VALUES (?, ?, ?, ?, UTC_TIMESTAMP())",
      [name, email, password, role],
    );
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
}

export default User;

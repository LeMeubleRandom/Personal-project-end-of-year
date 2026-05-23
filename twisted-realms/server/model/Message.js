// model/Message.js
import pool from '../db/mysql.js';

class Message {
    static async createMessage(userId, message) {
        const [result] = await pool.execute(
            "INSERT INTO message (message, userId, postDate) VALUES (?, ?, UTC_TIMESTAMP())",
            [message, userId]
        );
        return result;
    }

    /*SELECT m.id, m.message, m.postDate, m.userId, u.name AS name 
            FROM message m
            JOIN user u ON m.userId = u.id
            ORDER BY m.postDate ASC*/

    static async getAllMessages() {
        const [rows] = await pool.execute(`
            SELECT m.id, m.message, m.postDate,
            COALESCE(u.name , 'deletedUser') AS name
            FROM message m
            LEFT JOIN user u ON m.userId = u.id
            ORDER BY m.postDate ASC
        `);
        return rows;
    }

    static async getMessagesByUserId(userId) {
        const [rows] = await pool.execute(
            'SELECT * FROM message WHERE userId = ? ORDER BY postDate ASC',
            [userId]
        );
        return rows;
    }
}

export default Message;
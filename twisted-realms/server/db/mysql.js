import mysql from "mysql2/promise";
import "dotenv/config";

let pool;

if (process.env.DATABASE_URL) {
  pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  console.log("Pool de connexion MySQL initialisé avec DATABASE_URL (Aiven)");
} else {
  pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS ?? "root",
    database: process.env.DB_NAME || "twisted-realms",
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  console.log("Pool de connexion MySQL initialisé en local (sans SSL)");
}

export default pool;

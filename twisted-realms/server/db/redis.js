import { createClient } from "redis";
import "dotenv/config";

let redisClient;

if (process.env.REDIS_URL) {
  redisClient = createClient({
    url: process.env.REDIS_URL,
    socket: {
      tls: true,
      rejectUnauthorized: false,
    },
  });
  console.log("Client Redis initialisé avec REDIS_URL (Aiven)");
} else {
  redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST || "localhost"}:6379`,
  });
  console.log("Client Redis initialisé en local");
}

redisClient.on("error", (err) => console.error(" Erreur client Redis :", err));

await redisClient.connect();
console.log("Connecté à Redis");

export default redisClient;

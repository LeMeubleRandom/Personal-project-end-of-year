import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import pool from "./db/mysql.js";
import redisClient from "./db/redis.js";

import messageRouter from "./router/MessageRouter.js";
import userRouter from "./router/UserRouter.js";
import gameRouter from "./router/GameRouter.js";
import cardRouter from "./router/CardRouter.js";
import shopRouter from "./router/ShopRouter.js";
import GameManager from "./script/GameManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const allowedOrigins = [
  "http://localhost:5173",
  "http://10.45.31.81:5173",
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : []),
].filter(Boolean);

const app = express();
const server = createServer(app);
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200,
};
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.disable("x-powered-by");
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(
  "/user-images",
  express.static(join(__dirname, "../client/src/public/user-images")),
  express.static(join(__dirname, "../client/src/public/default-images")),
);

app.use((req, res, next) => {
  console.log("Requête reçue sur le backend :", req.url);
  next();
});

app.use("/message", messageRouter);
app.use("/user", userRouter);
app.use("/game", gameRouter);
app.use("/card", cardRouter);
app.use("/shop", shopRouter);

app.get("/", (req, res) => {
  res.send("Serveur Node.js opérationnel");
});

const PORT = process.env.PORT || 5000;

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("chat message", (msgData) => {
    console.log("nouveau message : ", msgData);
    io.emit("chat message", msgData);
  });

  socket.on("join game", ({ gameId, userId }) => {
    const roomName = `game_${gameId}`;
    socket.join(roomName);
    console.log(`User ${userId} joined room ${roomName}`);

    const gameInstance = GameManager.getGame(Number(gameId));
    if (gameInstance) {
      socket.emit("game state update", gameInstance);
    }
  });

  socket.on(
    "player action",
    async ({ gameId, playerId, actionType, payload }) => {
      const result = await GameManager.handlePlayerAction(
        Number(gameId),
        playerId,
        actionType,
        payload,
      );
      if (result.error) {
        socket.emit("action error", { message: result.error });
      } else {
        const roomName = `game_${gameId}`;
        io.to(roomName).emit("game state update", result.gameState);
      }
    },
  );

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(PORT, "0.0.0.0", () =>
  console.log(`Serveur lancé sur le port ${PORT}`),
);

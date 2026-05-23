import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { Server } from "socket.io";

import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import pool from './db/mysql.js';
import redisClient from './db/redis.js';

import messageRouter from './router/MessageRouter.js';
import userRouter from './router/UserRouter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const allowedOrigins = ['http://localhost:5173', 'http://10.45.31.81:5173'];

const app = express();
const server = createServer(app)
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200
};
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.disable('x-powered-by');
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/user-images', express.static(join(__dirname, '../public/user-images')));

app.use((req, res, next) => {
  console.log("Requête reçue sur le backend :", req.url);
  next();
});

app.use('/message', messageRouter);
app.use('/user', userRouter);

app.get('/', (req, res) => {
  res.send('Serveur Node.js opérationnel');
});

const PORT = process.env.PORT || 5000;

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('chat message', (msgData) => {
    console.log("nouveau message : ", msgData);
    io.emit('chat message', msgData)
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(PORT, '0.0.0.0', () => console.log(`Serveur lancé sur le port ${PORT}`));

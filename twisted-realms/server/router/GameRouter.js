import express from "express";
import GameController from "../controller/GameController.js";

import { verifyToken } from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/host", verifyToken, GameController.host);
router.post("/join", verifyToken, GameController.join);
router.post("/start", verifyToken, GameController.startGame);
router.post("/leave", verifyToken, GameController.leaveGame);

router.get("/", verifyToken, GameController.getAllLobby);
router.get("/start", verifyToken, GameController.getGameStart);
router.get("/:gameId", verifyToken, GameController.getLobby);

export default router;

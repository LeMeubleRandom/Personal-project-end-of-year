import express from "express";
import GameController from "../controller/GameController.js";

import { verifyToken } from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/host", verifyToken, GameController.host);
router.post("/join", verifyToken, GameController.join);

export default router;

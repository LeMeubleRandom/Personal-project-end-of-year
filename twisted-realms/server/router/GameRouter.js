import express from 'express';
import GameController from '../controller/GameController.js';

import { verifyToken } from '../middleware/auth.js';
import upload from "../middleware/multer.js";

const router = express.Router();

router.get("/start", verifyToken, GameController.start);

export default router;
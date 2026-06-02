import express from "express";
import CardController from "../controller/CardController.js";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", CardController.getAllCards);
router.get("/deck", CardController.getCardsByDeck);

export default router;

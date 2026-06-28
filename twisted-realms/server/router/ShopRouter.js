import express from "express";
import ShopController from "../controller/ShopController.js";

//Import des middlewares
import { verifyToken } from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/buy", verifyToken, ShopController.buyItem);
router.get("/items", verifyToken, ShopController.getItems);

export default router;

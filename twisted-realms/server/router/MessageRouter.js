import express from "express";
import MessageController from "../controller/MessageController.js";

const router = express.Router();

router.post("/", MessageController.postMessage);
router.get("/", MessageController.getAllMessages);
router.get("/:userId", MessageController.getAllMessagesByUserId);

export default router;

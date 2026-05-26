import express from "express";
import UserController from "../controller/UserController.js";

//Import des middlewares
import { verifyToken } from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/login", UserController.login);
router.post("/register", UserController.register);
router.post(
  "/profile",
  verifyToken,
  upload.single("image"),
  UserController.updateUserProfile,
);
router.post("/email", verifyToken, UserController.updateUserEmail);
router.post("/logout", verifyToken, UserController.logout);

router.get("/me", verifyToken, UserController.getMe);
router.get("/:userId", UserController.getUserById);

router.delete(
  "/deleteImage/:fileName",
  verifyToken,
  UserController.deleteUserImage,
);

export default router;

// controller/UserController.js
import User from "../model/User.js";
import UserService from "../service/UserService.js";
import fs from "fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { cp } from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default class UserController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const sessionData = await UserService.authenticateUser(email, password);

      res.cookie("token_twisted_realms", sessionData.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true en production (HTTPS)
        sameSite: "lax",
        maxAge: 1000 * 60 * 60,
      });

      res.status(200).json({
        status: "success",
        message: "Connexion réussie",
        user: sessionData.user,
      });
    } catch (error) {
      console.error("Error connexion:", error);
      res.status(401).json({ status: "error", message: error.message });
    }
  }

  static async register(req, res) {
    try {
      const { name, email, password } = req.body;
      const newUser = await UserService.registerUser(name, email, password);

      if (newUser) await User.createCollection(newUser.id);

      res.status(201).json({
        status: "success",
        message: `Bienvenue dans Twisted Realms, ${name}`,
        user: newUser,
      });
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  static async logout(req, res) {
    res.clearCookie("token_twisted_realms");
    res.status(200).json({ status: "success", message: "Déconnexion réussie" });
  }

  static async deleteUser(req, res) {
    try {
      const userId = req.userId;
      const user = await User.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ status: "error", message: "Utilisateur introuvable" });
      }

      if (user.userImage) {
        await UserService.deleteUserImage(user.userImage);
      }

      await User.deleteUser(userId);
      res.clearCookie("token_twisted_realms");

      res.status(200).json({
        status: "success",
        message: "Compte supprimé avec succès",
      });
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  static async getMe(req, res) {
    try {
      const user = await UserService.getUserProfile(req.userId);
      res.status(200).json({ status: "success", user });
    } catch (error) {
      res.status(404).json({ status: "error", message: error.message });
    }
  }

  static async getUserById(req, res) {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId);

      if (!user) {
        throw new Error("Joueur introuvable.");
      }

      delete user.password;
      res.status(200).json(user);
    } catch (error) {
      console.error("Error getUserById", error);
      res.status(500).json({ status: "error", message: "erreur serveur" });
    }
  }

  static async updateUserProfile(req, res) {
    try {
      const { name, oldImage, defaultImage } = req.body;
      const currentUser = await User.findById(req.userId);
      if (!currentUser) {
        return res
          .status(404)
          .json({ status: "error", message: "Utilisateur introuvable." });
      }

      let imageFileName = currentUser.userImage;
      let shouldDeleteOldImage = false;

      if (req.file) {
        imageFileName = req.file.filename;
        shouldDeleteOldImage = true;
      } else if (defaultImage) {
        // Strip folder prefix if it's sent as default-images/filename.png
        const plainFileName = defaultImage.split("/").pop().split("\\").pop();
        imageFileName = await UserService.copyDefaultImage(plainFileName);
        shouldDeleteOldImage = true;
      }

      console.log("Name:", name);
      console.log("Old Image:", oldImage);
      console.log("New Image File:", imageFileName);

      const updatedUser = await User.updateUserProfile(
        name,
        imageFileName,
        req.userId,
      );

      if (!updatedUser) {
        return res
          .status(400)
          .json({ status: "error", message: "Aucune donnée à mettre à jour." });
      }

      if (shouldDeleteOldImage && oldImage) {
        await UserService.deleteUserImage(oldImage);
      }

      res.status(200).json({
        status: "success",
        message: "Profil mis à jour avec succès !",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updateUserProfile:", error);
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  static async updateUserEmail(req, res) {
    try {
      const { email } = req.body;
      console.log(email);

      const updatedUser = await User.updateUserEmail(email, req.userId);

      if (!updatedUser) {
        return res
          .status(400)
          .json({ status: "error", message: "Aucune donnée à mettre à jour." });
      }

      res.status(200).json({
        status: "success",
        message: "Email mis à jour avec succès !",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updateUserEmail", error);
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  static async getAllDecksByUserId(req, res) {
    try {
      const userId = req.userId;
      const decks = await User.findDecksByUserId(userId);

      if (!decks) {
        throw new Error("decks introuvables.");
      }

      res.status(200).json(decks);
    } catch (error) {
      console.error("Error getAllDecks", error);
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  static async createDeck(req, res) {
    try {
      const { userId, name } = req.body;
      const response = await User.createDeck(userId, name);

      res.status(200).json(response);
    } catch (error) {
      console.error("Error createDeck", error);
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  static async updateDeck(req, res) {
    try {
      const { id, name, cardList, mainCard } = req.body;
      const response = await User.updateDeck(id, name, cardList, mainCard);

      res.status(200).json(response);
    } catch (error) {
      console.error("Error updateDeck", error);
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  static async getDeck(req, res) {
    try {
      const userId = req.userId;
      const deck = await User.getDeck(id);

      res.status(200).json(deck);
    } catch (error) {
      console.error("Error getDeck", error);
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  static async deleteDeck(req, res) {
    try {
      const { id } = req.body;
      const response = await User.deleteDeck(id);

      res.status(200).json(response);
    } catch (error) {
      console.error("Error deleteDeck", error);
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  static async deleteUserImage(req, res) {
    try {
      const { fileName } = req.params;
      await UserService.deleteUserImage(fileName);
      res
        .status(200)
        .json({ status: "success", message: "Image supprimée avec succès" });
    } catch (error) {
      console.error("Error deleteUserImage:", error);
      res.status(500).json({
        status: "error",
        message: "Erreur serveur lors de la suppression de l'image",
      });
    }
  }

  static async getCollection(req, res) {
    try {
      const userId = req.userId;
      const collection = await User.getCollection(userId);
      res.status(200).json(collection);
    } catch (error) {
      console.error("Error getCollection:", error);
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
}

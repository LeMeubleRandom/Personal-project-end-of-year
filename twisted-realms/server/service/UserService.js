import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/User.js";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class UserService {
  static async registerUser(name, email, password) {
    const userEmail = await User.findByEmail(email);
    const userName = await User.findByName(name);

    if (userEmail) {
      throw new Error("Cet email est déjà utilisé par un autre joueur");
    }

    if (userName) {
      throw new Error("Ce pseudo est déjà utilisé par un autre joueur");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Sélection d'une image par défaut aléatoire
    const userImage = await this.randUserImage();

    const result = await User.createUser(
      name,
      email,
      hashedPassword,
      userImage,
    );

    return {
      id: result.insertId,
      name: name,
      email: email,
      userImage: userImage,
    };
  }

  static async authenticateUser(email, password) {
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error("Email ou mot de passe incorrect.");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error("Email ou mot de passe incorrect.");
    }

    const token = jwt.sign(
      { id: user.id, name: user.name },
      process.env.JWT_SECRET || "secret_de_secours_super_long",
      { expiresIn: "24h" },
    );

    return {
      token: token,
      user: {
        id: user.id,
        name: user.name,
        userImage: user.userImage,
        role: user.role,
        date: user.date,
        isGlobalChat: user.isGlobalChat,
      },
    };
  }

  static async getUserProfile(userId) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new Error("Joueur introuvable.");
      }

      delete user.password;

      return user;
    } catch (error) {
      console.error("Erreur lors de la récupération des données", error);
    }
  }

  static async deleteUserImage(fileName) {
    console.log(fileName);
    if (!fileName) return;

    const cleanFileName = fileName.split("/").pop().split("\\").pop();
    console.log(cleanFileName);

    const filePath = path.join(
      __dirname,
      "../../client/src/public/user-images",
      cleanFileName,
    );
    console.log(filePath);

    try {
      await fs.promises.unlink(filePath);
      console.log("Ancienne image supprimée avec succès");
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de l'ancienne image:",
        error,
      );
    }
  }

  static async copyDefaultImage(fileName) {
    if (!fileName) return null;
    try {
      const defaultPath = path.join(
        __dirname,
        "../../client/src/public/default-images",
        fileName,
      );
      const uniqueName = `default-${Date.now()}-${Math.floor(Math.random() * 1000000)}${path.extname(fileName)}`;
      const userImagesPath = path.join(
        __dirname,
        "../../client/src/public/user-images",
        uniqueName,
      );

      await fs.promises.mkdir(path.dirname(userImagesPath), {
        recursive: true,
      });
      await fs.promises.copyFile(defaultPath, userImagesPath);
      return uniqueName;
    } catch (error) {
      console.error("Erreur lors de la copie de l'image par défaut :", error);
      return null;
    }
  }

  static async randUserImage() {
    try {
      const cheminDossier = path.join(
        __dirname,
        "../../client/src/public/default-images",
      );

      const fichiers = fs.readdirSync(cheminDossier);
      console.log(`fichiers :`, fichiers);

      if (fichiers.length === 0) return null;
      const randomIdx = Math.floor(Math.random() * fichiers.length);
      return fichiers[randomIdx];
    } catch (error) {
      console.error("Impossible de lire le dossier", error);
    }
  }
}

export default UserService;

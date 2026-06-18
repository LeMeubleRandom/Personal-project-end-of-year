import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/User.js";

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

    const result = await User.createUser(name, email, hashedPassword);

    return {
      id: result.insertId,
      name: name,
      email: email,
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
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("Joueur introuvable.");
    }

    delete user.password;

    return user;
  }

  static async deleteUserImage(fileName) {
    console.log(fileName);
    if (!fileName) return;

    const cleanFileName = fileName.split("/").pop().split("\\").pop();
    console.log(cleanFileName);

    const filePath = join(__dirname, "../../client/public/user-images", cleanFileName);
    console.log(filePath);

    try {
      await fs.promises.unlink(filePath);
      console.log("Ancienne image supprimée avec succès");
    } catch (err) {
      console.error("Erreur lors de la suppression de l'ancienne image:", err);
    }
  }
}

export default UserService;

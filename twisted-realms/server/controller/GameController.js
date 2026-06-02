import GameManager from "../script/GameManager.js";
import crypto from "crypto";

export default class GameController {
  static async start(req, res) {
    try {
      const gameId = crypto.randomUUID();
      //GameManager.startGame(gameId);

      res.status(200).json({ status: "success", message: "Partie créée" });
    } catch (error) {
      console.error("Error creatingGame:", error);
      res.status(500).json({ status: "error", message: "Erreur serveur" });
    }
  }
}

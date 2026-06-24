import GameManager from "../script/GameManager.js";
import crypto from "crypto";

export default class GameController {
  static async host(req, res) {
    try {
      const gameId = crypto.randomUUID();
      const { userId, userName } = req.body;

      const game = await Game.createGame(gameId, userId, userName);
      //GameManager.startGame(gameId);

      res.status(200).json(game);
    } catch (error) {
      console.error("Error creatingGame:", error);
      res.status(500).json({ status: "error", message: "Erreur serveur" });
    }
  }

  static async join(req, res) {
    try {
      res.status(200).json("join");
    } catch (error) {
      console.error("Error joiningGame:", error);
      res.status(500).json({ status: "error", message: "Erreur serveur" });
    }
  }
}

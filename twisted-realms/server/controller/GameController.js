import GameManager from "../script/GameManager.js";
import crypto from "crypto";

import Game from "../model/Game.js";

export default class GameController {
  static async host(req, res) {
    try {
      const gameId = Math.floor(100000 + Math.random() * 900000);
      const { userId, activeDeck } = req.body;

      const game = await Game.createGame(gameId, userId, activeDeck);
      //GameManager.startGame(gameId);

      res.status(200).json(game);
    } catch (error) {
      console.error("Error creatingGame:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  static async join(req, res) {
    try {
      const { userId, activeDeck, gameId } = req.body;

      const game = await game.joinGame(gameId, userId, activeDeck);

      res.status(200).json(game);
    } catch (error) {
      console.error("Error joiningGame:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  static async getLobbys(req, res) {
    try {
      const lobbys = await Game.getLobbys();
      res.status(200).json(lobbys);
    } catch (error) {
      console.error("Error getLobbys  :", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }
}

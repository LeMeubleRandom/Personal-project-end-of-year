// controller/CardController.js
import Card from "../model/Card.js";

export default class CardController {
  static async getAllCards(req, res) {
    try {
      const cards = await Card.getAllCards();
      res.status(200).json(cards);
    } catch (error) {
      console.error("Error getAllCards:", error);
      res.status(500).json({ status: "error", message: "Erreur serveur" });
    }
  }

  static async getCardsByDeck(req, res) {
    try {
      const cardListParam = req.query.cardList;
      if (!cardListParam) {
        return res
          .status(400)
          .json({ status: "error", message: "cardList requis" });
      }
      const cards = await Card.getCardsByDeck(JSON.parse(cardListParam));
      res.status(200).json(cards);
    } catch (error) {
      console.error("Error getCardsByDeck:", error);
      res.status(500).json({ status: "error", message: "Erreur serveur" });
    }
  }
}

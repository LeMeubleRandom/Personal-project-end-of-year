// controller/ShopController.js
import Shop from "../model/Shop.js";
import User from "../model/User.js";
import ShopService from "../service/ShopService.js";

export default class ShopController {
  static async getItems(req, res) {
    try {
      const items = await Shop.getItems();
      res.status(200).json(items);
    } catch (error) {
      console.error("Error getItems :", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  static async buyItem(req, res) {
    try {
      const { id, type } = req.body;
      const item = await Shop.findItemByIdType(id, type);
      const user = await User.findById(req.userId);

      if (!item || !user) {
        return res.status(404).json({
          status: "error",
          message: "Utilisateur ou Objet introuvable",
        });
      }

      const checkCredits = await ShopService.checkCredits(
        item.price,
        user.credits,
      );

      if (!checkCredits)
        return res
          .status(400)
          .json({ status: "error", message: "Crédits insuffisants" });

      const buyResponse = await ShopService.buyItem(item, user);
      const addResponse = await ShopService.addItems(item, user);
      if (!buyResponse || !addResponse) {
        return res.status(400).json({
          status: "error",
          message: "Erreur lors de la mise à jour des données utilisateur",
        });
      }
      return res.status(200).json({
        status: "success",
        message: "Achat réalisé avec succès",
        drawnCards: addResponse.drawnCards || null,
      });
    } catch (error) {
      console.error("Error buyItem :", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }
}

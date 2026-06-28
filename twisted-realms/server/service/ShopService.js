import User from "../model/User.js";
import Shop from "../model/Shop.js";

class ShopService {
  static async checkCredits(price, userCredits) {
    try {
      if (userCredits >= price) return true;
      else return false;
    } catch (error) {
      console.error("Erreur lors de la récupération des données", error);
    }
  }

  static async buyItem(item, user) {
    try {
      const updateCredits = await User.buyItem(user, item.price);
      if (!updateCredits) {
        throw new Error("Erreur lors de l'échange des crédits");
      }
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour des données", error);
      return false;
    }
  }

  static async addItems(item, user) {
    try {
      let cardList = item.cardList;
      if (typeof cardList === "string") cardList = JSON.parse(cardList);

      if (item.type === "deck") {
        await User.addDeckToUser(user.id, item.name, cardList, item.mainCardId);

        await User.addCardsToCollection(user.id, cardList);

        return { success: true };
      } else if (item.type === "pack") {
        const drawnCards = [];
        for (let i = 0; i < item.containedCard; i++) {
          const randomIndex = Math.floor(Math.random() * cardList.length);
          drawnCards.push(cardList[randomIndex]);
        }

        await User.addCardsToCollection(user.id, drawnCards);

        return { success: true, drawnCards };
      }
      return false;
    } catch (error) {
      console.error("Erreur lors de la mise à jour des données", error);
      return false;
    }
  }
}

export default ShopService;

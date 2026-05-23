// controller/MessageController.js
import Message from '../model/Message.js';

class MessageController {
    static async postMessage(req, res) {
        try {
            const { userId, message } = req.body;
            
            await Message.createMessage(userId, message);
            
            res.status(201).json({ status: "success", message: "Message sauvegardé !" });
        } catch (error) {
            console.error("Error postMessage:", error);
            res.status(500).json({ status: "error", message: "Erreur serveur" });
        }
    }

    static async getAllMessages(req, res) {
        try {
            const userId = req.params.userId;
            const messages = await Message.getAllMessages();
            res.status(200).json(messages);
        } catch (error) {
            console.error("Error getMessages:", error);
            res.status(500).json({ status: "error", message: "Erreur serveur" });
        }
    }

    static async getAllMessagesByUserId(req, res) {
        try {
            const userId = req.params.userId;
            const userMessages = await Message.getMessagesByUserId(userId);
            res.status(200).json(userMessages);
        } catch (error) {
            console.error("Error getMessageById", error);
            res.status(500).json({ status: "error", message: "erreur serveur" });
        }
    }
}

export default MessageController;
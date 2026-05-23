// controller/UserController.js
import User from '../model/User.js';
import UserService from '../service/UserService.js';
import fs from 'fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class UserController {
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            const sessionData = await UserService.authenticateUser(email, password);

            res.cookie('token_twisted_realms', sessionData.token, {
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production', // true en production (HTTPS)
                sameSite: 'lax',
                maxAge: 1000 * 60 * 60
            });

            res.status(200).json({
                status: "success", 
                message: "Connexion réussie",
                user: sessionData.user
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

            res.status(201).json({
                status: "success",
                message: `Bienvenue dans Twisted Realms, ${name}`,
                user: newUser
            });
        } catch (error) {
            res.status(400).json({ status: "error", message: error.message });
        }
    }

    static async logout(req, res) {
        res.clearCookie('token_twisted_realms');
        res.status(200).json({ status: "success", message: "Déconnexion réussie" });
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
            const { name } = req.body;
            const imageFileName = req.file ? req.file.filename : null;

            const updatedUser = await User.updateUserProfile(name, imageFileName, req.userId);

            if (!updatedUser) {
                return res.status(400).json({ status: 'error', message: 'Aucune donnée à mettre à jour.' });
            }

            res.status(200).json({ 
                status: 'success', 
                message: 'Profil mis à jour avec succès !',
                user: updatedUser
            });
        } catch (error) {
            console.error('Error updateUserProfile:', error);
            res.status(400).json({ status: 'error', message: error.message });
        }
    }

    static async deleteUserImage(req, res) {
        const fileName = req.params.fileName;
        
        const filePath = join(__dirname, '../../public/user-images', fileName);

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error("Erreur lors de la suppression:", err);
                return res.status(500).json({ status: "error", message: "Impossible de supprimer le fichier" });
            }
            
            res.status(200).json({ status: "success", message: "Fichier supprimé" });
        });
    }
}

export default UserController;
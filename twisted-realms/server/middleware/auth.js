import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token_twisted_realms;

    if (!token) {
        return res.status(401).json({ message: "Accès refusé. Non connecté." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_de_secours_super_long');
        
        req.userId = decoded.id;
        
        next();
    } catch (error) {
        res.clearCookie('token_twisted_realms');
        return res.status(401).json({ message: "Session expirée ou invalide." });
    }
};
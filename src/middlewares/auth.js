import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
    // Esperamos header: "Authorization: Bearer <token>"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Acceso denegado: Token no proporcionado" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
        if (err) {
            return res.status(403).json({ error: "Token inválido o expirado" });
        }
        // Guardamos los datos del usuario en la request para usarlos luego
        req.usuario = usuario;
        next();
    });
};
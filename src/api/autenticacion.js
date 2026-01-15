import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'; 
import con from '../config/db.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const { usuario, clave } = req.body;

    if (!usuario || !clave) return res.status(400).json({ error: "Faltan datos" });

    try {
        const [rows] = await con.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);
        const user = rows[0];

        // Compatibilidad con MD5 (Educativo)
        const claveMD5 = crypto.createHash('md5').update(clave).digest('hex');

        if (user && user.clave === claveMD5) {
            const token = jwt.sign(
                { id: user.id, usuario: user.usuario, rol: user.rol },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            res.json({ token, rol: user.rol });
        } else {
            res.status(401).json({ error: "Credenciales incorrectas" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;
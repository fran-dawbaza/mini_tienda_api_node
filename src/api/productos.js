import express from 'express';
import con from '../config/db.js';
import { verificarToken } from '../middlewares/auth.js';

const router = express.Router();

// Ruta protegida: GET /api/productos
router.get('/', verificarToken, async (req, res) => {
    try {
        const [productos] = await con.query('SELECT * FROM productos');
        // Convertimos precio a número (MySQL a veces devuelve strings en DECIMAL)
        const productosFormateados = productos.map(p => ({
            ...p,
            precio: parseFloat(p.precio)
        }));
        res.json(productosFormateados);
    } catch (error) {
        res.status(500).json({ error: "Error obteniendo productos" });
    }
});

export default router;
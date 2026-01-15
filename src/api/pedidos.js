import express from 'express';
import con from '../config/db.js';
import { verificarToken } from '../middlewares/auth.js';

const router = express.Router();

// Crear pedido: POST /api/pedidos
router.post('/', verificarToken, async (req, res) => {
    const { items, total } = req.body;
    const usuario_id = req.usuario.id; // Obtenido del token

    try {
        const itemsJson = JSON.stringify(items);
        await con.query(
            'INSERT INTO pedidos (usuario_id, total, items_json) VALUES (?, ?, ?)',
            [usuario_id, total, itemsJson]
        );
        res.json({ mensaje: "Pedido realizado con éxito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al guardar el pedido" });
    }
});

// Ver pedidos (Admin): GET /api/pedidos
router.get('/', verificarToken, async (req, res) => {
    if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ error: "Requiere rol de administrador" });
    }

    try {
        const sql = `
            SELECT pedidos.*, usuarios.usuario 
            FROM pedidos 
            JOIN usuarios ON pedidos.usuario_id = usuarios.id 
            ORDER BY fecha DESC
        `;
        const [pedidos] = await pool.query(sql);
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ error: "Error obteniendo pedidos" });
    }
});

export default router;
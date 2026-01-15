import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importar rutas
import rutasAutenticacion from './api/autenticacion.js';
import rutasProductos from './api/productos.js';
import rutasPedidos from './api/pedidos.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares Globales
app.use(cors()); // Permite peticiones cruzadas
app.use(express.json()); // Parsea el body JSON (fundamental)

// Servir Frontend (Archivos Estáticos)
// Al entrar a http://localhost:3000 cargará index.html de la carpeta public
app.use(express.static('public'));

// Rutas de la API 
app.use('/api/autenticacion', rutasAutenticacion);
app.use('/api/productos', rutasProductos);
app.use('/api/pedidos', rutasPedidos);

// Arrancar servidor
app.listen(PORT, () => {
    console.log(`Servidor Node.js corriendo en http://localhost:${PORT}`);
});
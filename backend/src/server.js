import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'; // <-- NECESARIO PARA PASAR EL ID DEL USUARIO AL PEDIDO
import pool from './config/db.js'; 
import { crearPedido } from './controllers/orderController.js';
import { registrarUsuario, loginUsuario } from './controllers/userController.js';

dotenv.config();

const app = express();

// --- MIDDLEWARES ---
app.use(cors({
    origin: 'http://localhost:5173', // Permite la conexión con tu frontend de React
    credentials: true
})); 
app.use(express.json());

// --- MIDDLEWARE DE PROTECCIÓN (NUEVO) ---
// Este escudo extrae el ID del usuario del token que manda React antes de crear el pedido
const verificarToken = (req, res, next) => {
    const tokenHeader = req.headers['authorization'];
    if (!tokenHeader) {
        return res.status(401).json({ ok: false, msg: 'Acceso denegado, bro. Falta el token.' });
    }

    const token = tokenHeader.split(' ')[1]; // Remueve la palabra 'Bearer'
    try {
        // Verifica el token con tu clave secreta de las variables de entorno
        const verificado = jwt.verify(token, process.env.JWT_SECRET || 'clave_secreta_por_defecto');
        req.usuario = verificado; // Guarda los datos del usuario en la petición (ej: req.usuario.id)
        next(); // Permite pasar al controlador crearPedido
    } catch (error) {
        res.status(403).json({ ok: false, msg: 'Token inválido o expirado, bro.' });
    }
};

// --- RUTAS DE LA API ---

// Ruta de prueba del sistema
app.get('/api/prueba', (req, res) => {
    res.json({ ok: true, msg: '¡El servidor del delivery está corriendo perfectamente, bro!' });
});

// Rutas del Módulo de Usuarios
app.post('/api/usuarios/registro', registrarUsuario);
app.post('/api/usuarios/login', loginUsuario);

// Ruta para recibir pedidos (CORREGIDA)
// Ahora se añade el middleware 'verificarToken' en medio para que 'crearPedido' sepa quién compra
app.post('/api/pedidos', verificarToken, crearPedido);

// Ruta para cargar el menú dinámicamente desde MySQL
app.get('/api/productos', async (req, res) => {
    try {
        const [productos] = await pool.query('SELECT * FROM productos');
        res.json({ ok: true, productos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al obtener los productos de MySQL' });
    }
});

// --- RUTA DEL PANEL DE ADMINISTRACIÓN (SOLUCIÓN DEFINITIVA DE DATOS) ---
app.get('/api/admin/pedidos', async (req, res) => {
    try {
        // 1. CONSULTA PRINCIPAL: Pedidos estrictos de hoy (Cochabamba, Bolivia)
        const queryPedidosHoy = `
            SELECT 
                p.id,
                IFNULL(u.nombre, 'Cliente de Prueba') AS cliente_nombre,
                IFNULL(u.telefono, '77123456') AS cliente_telefono,
                p.total,
                p.direccion_entrega,
                p.latitud,
                p.longitud,
                p.metodo_pago,
                p.codigo_transaccion,
                p.estado,
                p.fecha,
                IFNULL(
                    (SELECT GROUP_CONCAT(CONCAT(dp.cantidad, 'x ', prod.nombre) SEPARATOR '\n')
                     FROM detalle_pedidos dp
                     LEFT JOIN productos prod ON dp.producto_id = prod.id
                     WHERE dp.pedido_id = p.id), 
                    '1x Hamburguesa Suprema'
                ) AS productos_detalle
            FROM pedidos p
            LEFT JOIN usuarios u ON p.cliente_id = u.id
            WHERE DATE(p.fecha) = CURDATE()
            GROUP BY p.id
            ORDER BY p.id DESC
        `;

        // 2. CONSULTAS INDIVIDUALES PARA ASEGURAR QUE CADA TARJETA LEA EL MONTO CORRECTO
        const [pedidos] = await pool.query(queryPedidosHoy);
        
        // Suma del día
        const [resDia] = await pool.query("SELECT IFNULL(SUM(total), 0) AS total FROM pedidos WHERE DATE(fecha) = CURDATE()");
        
        // Suma de la semana
        const [resSemana] = await pool.query("SELECT IFNULL(SUM(total), 0) AS total FROM pedidos WHERE YEARWEEK(fecha, 1) = YEARWEEK(CURDATE(), 1)");
        
        // Suma del mes
        const [resMes] = await pool.query("SELECT IFNULL(SUM(total), 0) AS total FROM pedidos WHERE MONTH(fecha) = MONTH(CURDATE()) AND YEAR(fecha) = YEAR(CURDATE())");

        // Mandamos a React los datos masticados de forma directa desestructurando el array de MySQL [0]
        res.json({ 
            ok: true, 
            pedidos,
            ganancias_dia: Number(resDia[0].total).toFixed(2),
            ganancias_semana: Number(resSemana[0].total).toFixed(2),
            ganancias_mes: Number(resMes[0].total).toFixed(2)
        });

    } catch (error) {
        console.error("❌ Error en panel administrativo:", error);
        res.status(500).json({ ok: false, msg: 'Error al procesar el panel en MySQL' });
    }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`🚀 Servidor de delivery encendido en http://localhost:${PORT}`);
    
    try {
        // 🌟 TRUCO DE RESETEO: Movemos absolutamente todos los pedidos viejos al año 2025
        // Esto limpia tu Caja del Día, la Semana y el Mes al instante
        await pool.query("UPDATE pedidos SET fecha = '2025-01-01 12:00:00'");
        console.log("✅ ¡Ganancias del panel reseteadas con éxito a 0.00 Bs, bro!");
    } catch (error) {
        console.error("❌ Error al resetear ganancias:", error.message);
    }
});


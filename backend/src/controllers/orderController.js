import pool from '../config/db.js';

export const crearPedido = async (req, res) => {
    const { 
        direccion_entrega, 
        latitud, 
        longitud, 
        metodo_pago, 
        codigo_transaccion, 
        productos, 
        total 
    } = req.body;

    // Capturamos el ID del usuario autenticado o asignamos el ID 1 de respaldo
    const usuarioRealId = req.usuario?.id || req.body.cliente_id || 1;

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction(); 

        // Insertar encabezado FORZANDO la fecha actual del sistema (NOW())
        const queryPedido = `
            INSERT INTO pedidos (cliente_id, total, direccion_entrega, latitud, longitud, metodo_pago, codigo_transaccion, estado, fecha) 
            VALUES (?, ?, ?, ?, ?, ?, ?, 'pendiente', NOW())
        `;
        const [resultPedido] = await connection.query(queryPedido, [
            usuarioRealId, 
            total || 0.00, 
            direccion_entrega || 'Dirección de prueba', 
            latitud || null, 
            longitud || null, 
            metodo_pago || 'efectivo', 
            codigo_transaccion || null 
        ]);
        
        const pedidoId = resultPedido.insertId;

        // Insertar productos en el detalle de forma segura
        const queryDetalle = `
            INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario) 
            VALUES (?, ?, ?, ?)
        `;

        if (productos && productos.length > 0) {
            for (const item of productos) {
                // Mapeo tolerante: verifica si viene como producto_id o id de forma indistinta
                const prodId = item.producto_id || item.id;
                const precioUnid = item.precio_unitario || item.precio || 0;
                
                if (prodId) {
                    await connection.query(queryDetalle, [pedidoId, prodId, item.cantidad, precioUnid]);
                }
            }
        }

        await connection.commit(); 
        
        res.status(201).json({
            ok: true,
            msg: 'Pedido registrado con éxito, bro',
            pedido_id: pedidoId
        });

    } catch (error) {
        await connection.rollback(); 
        console.error('❌ Error interno en el controlador:', error.message);
        res.status(500).json({ ok: false, msg: 'Error en el servidor', error: error.message });
    } finally {
        connection.release(); 
    }
};

USE delivery_db;

-- 1. Modificar la tabla pedidos para soportar el método QR
ALTER TABLE pedidos 
MODIFY COLUMN metodo_pago ENUM('efectivo', 'tarjeta', 'qr') NOT NULL;

-- 2. Añadir columna para el código de transferencia bancaria
ALTER TABLE pedidos 
ADD COLUMN codigo_transaccion VARCHAR(100) DEFAULT NULL AFTER metodo_pago;

-- 3. Añadir columnas para las coordenadas GPS de la entrega
ALTER TABLE pedidos 
ADD COLUMN latitud DECIMAL(10, 8) DEFAULT NULL AFTER direccion_entrega,
ADD COLUMN longitud DECIMAL(11, 8) DEFAULT NULL AFTER latitud;

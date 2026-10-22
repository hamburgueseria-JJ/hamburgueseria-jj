CREATE DATABASE IF NOT EXISTS delivery_db;
USE delivery_db;

-- 1. TABLA DE USUARIOS (Maneja roles: Cliente, Admin, Repartidor)
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Aquí guardarás el hash (bcrypt)
    telefono VARCHAR(20),
    rol ENUM('cliente', 'administrador', 'repartidor') DEFAULT 'cliente',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABLA DE PRODUCTOS (Menú del restaurante)
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    imagen_url VARCHAR(255),
    disponible BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABLA DE PEDIDOS (Encabezado del pedido)
CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    repartidor_id INT DEFAULT NULL,
    total DECIMAL(10, 2) NOT NULL,
    estado ENUM('pendiente', 'preparando', 'en camino', 'entregado', 'cancelado') DEFAULT 'pendiente',
    direccion_entrega TEXT NOT NULL,
    metodo_pago ENUM('efectivo', 'tarjeta') NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (repartidor_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- 4. TABLA DE DETALLE DE PEDIDOS (Relación de Muchos a Muchos entre Pedidos y Productos)
CREATE TABLE detalle_pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL, -- Se guarda para congelar el precio del momento de la compra
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

USE delivery_db;

-- Insertar la Hamburguesa (ID 1)
INSERT INTO productos (id, nombre, descripcion, precio, disponible)
VALUES (1, 'Hamburguesa Suprema', 'Con queso fundido, tocino y papas fritas', 15.00, true);

-- Insertar la Salsa/Bebida (ID 2)
INSERT INTO productos (id, nombre, descripcion, precio, disponible)
VALUES (2, 'Gaseosa Mediana', 'Bebida fría de 500ml', 5.50, true);

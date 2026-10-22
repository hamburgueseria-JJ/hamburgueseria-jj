import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Probar conexión inicial
try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión exitosa a MySQL Database');
    connection.release();
} catch (error) {
    console.error('❌ Error conectando a MySQL:', error.message);
}

export default pool;

import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// 1. REGISTRO DE USUARIOS
export const registrarUsuario = async (req, res) => {
    const { nombre, email, password, telefono, rol } = req.body;

    try {
        // Verificar si el correo ya está registrado
        const [existeUsuario] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (existeUsuario.length > 0) {
            return res.status(400).json({ ok: false, msg: 'El correo ya está registrado, bro' });
        }

        // Cifrar la contraseña (Seguridad informática para tu tesis)
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Insertar usuario en la base de datos MySQL
        // Si no se envía rol, por defecto en la BD se guarda como 'cliente'
        const query = `
            INSERT INTO usuarios (nombre, email, password, telefono, rol) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const [resultado] = await pool.query(query, [nombre, email, passwordHash, telefono, rol || 'cliente']);

        res.status(201).json({
            ok: true,
            msg: 'Usuario registrado con éxito',
            usuario_id: resultado.insertId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error interno al registrar usuario' });
    }
};

// 2. LOGIN DE USUARIOS
export const loginUsuario = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar el usuario por email
        const [usuarios] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (usuarios.length === 0) {
            return res.status(400).json({ ok: false, msg: 'Credenciales incorrectas (Email no encontrado)' });
        }

        const usuario = usuarios[0];

        // Verificar si la contraseña coincide con el Hash guardado en la BD
        const passwordValido = await bcrypt.compare(password, usuario.password);
        if (!passwordValido) {
            return res.status(400).json({ ok: false, msg: 'Credenciales incorrectas (Contraseña inválida)' });
        }

        // Generar el Token de Sesión JWT (Válido por 2 horas)
        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol },
            process.env.JWT_SECRET || 'clave_secreta_por_defecto',
            { expiresIn: '2h' }
        );

        // Responder al cliente con los datos básicos y su Token
        res.json({
            ok: true,
            msg: 'Login exitoso, ¡bienvenido!',
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            },
            token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error interno al iniciar sesión' });
    }
};

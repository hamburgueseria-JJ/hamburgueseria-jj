import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Registro() {
    const [formData, setFormData] = useState({ nombre: '', email: '', password: '' });
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();

    const manejarCambio = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();
        try {
            const respuesta = await axios.post('http://localhost:5000/api/usuarios/registro', formData);
            if (respuesta.data.ok) {
                setMensaje('¡Usuario registrado con éxito, bro! Redirigiendo...');
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (error) {
            setMensaje(error.response?.data?.msg || 'Error al registrar usuario');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f4f6f9', fontFamily: 'sans-serif' }}>
            <form onSubmit={manejarEnvio} style={{ background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '320px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>📝 Crear Cuenta</h2>
                
                {mensaje && <p style={{ color: mensaje.includes('éxito') ? 'green' : 'red', textAlign: 'center', fontSize: '14px' }}>{mensaje}</p>}

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#555' }}>Nombre</label>
                    <input type="text" name="nombre" onChange={manejarCambio} required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#555' }}>Correo Electrónico</label>
                    <input type="email" name="email" onChange={manejarCambio} required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#555' }}>Contraseña</label>
                    <input type="password" name="password" onChange={manejarCambio} required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} />
                </div>

                <button type="submit" style={{ width: '100%', background: '#28a745', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
                    Registrarse
                </button>

                <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px', color: '#666' }}>
                    ¿Ya tienes cuenta? <span onClick={() => navigate('/login')} style={{ color: '#007BFF', cursor: 'pointer', fontWeight: 'bold' }}>Inicia sesión aquí</span>
                </p>
            </form>
        </div>
    );
}

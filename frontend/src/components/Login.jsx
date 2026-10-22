import React, { useState } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';

export default function Login() {
    // Añadimos 'telefono' al estado inicial del formulario
    const [formData, setFormData] = useState({ email: '', password: '', telefono: '' });
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();

    const manejarCambio = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();
        try {
            const respuesta = await axios.post('http://localhost:5000/api/usuarios/login', formData);
            if (respuesta.data.ok) {
                // Guardamos el token y los datos esenciales en localStorage
                localStorage.setItem('token', respuesta.data.token);
                localStorage.setItem('nombre_usuario', respuesta.data.usuario?.nombre);
                setMensaje('¡Sesión iniciada! Entrando al sistema...');
                
                // Redirección según el rol del usuario
                setTimeout(() => {
                    if (respuesta.data.usuario?.rol === 'admin') {
                        navigate('/admin');
                    } else {
                        navigate('/menu'); 
                    }
                }, 1500);
            }
        } catch (error) {
            setMensaje(error.response?.data?.msg || 'Credenciales incorrectas, bro');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f4f6f9', fontFamily: 'sans-serif' }}>
            <form onSubmit={manejarEnvio} style={{ background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '360px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>🔑 Iniciar Sesión</h2>
                
                {mensaje && <p style={{ color: mensaje.includes('Entrando') ? 'green' : 'red', textAlign: 'center', fontSize: '14px' }}>{mensaje}</p>}

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#555' }}>Correo Electrónico</label>
                    <input type="email" name="email" value={formData.email} onChange={manejarCambio} required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} />
                </div>

                {/* 📞 NUEVA CAJA: NÚMERO CELULAR */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#555' }}>Número Celular</label>
                    <input type="tel" name="telefono" value={formData.telefono} onChange={manejarCambio} placeholder="Ej. 77123456" style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#555' }}>Contraseña</label>
                    <input type="password" name="password" value={formData.password} onChange={manejarCambio} required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} />
                </div>

                <button type="submit" style={{ width: '100%', background: '#007BFF', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
                    Ingresar
                </button>

                <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px', color: '#666' }}>
                    ¿No tienes cuenta? <span onClick={() => navigate('/registro')} style={{ color: '#28a745', cursor: 'pointer', fontWeight: 'bold' }}>Regístrate aquí</span>
                </p>
            </form>
        </div>
    );
}

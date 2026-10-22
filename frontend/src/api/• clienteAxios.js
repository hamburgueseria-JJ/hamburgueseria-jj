import axios from 'axios';

const clienteAxios = axios.create({
    baseURL: 'http://localhost:5000/api' // La URL exacta de tu backend
});

// Este interceptor le pegará el token JWT automáticamente a tus peticiones cuando el cliente inicie sesión
clienteAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default clienteAxios;

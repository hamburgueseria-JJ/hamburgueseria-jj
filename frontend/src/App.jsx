import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Menu from './components/Menu';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import Registro from './components/Registro';
import RutaProtegida from './components/RutaProtegida';

function App() {
  return (
    <Router>
      <Routes>
        {/* Configurado para que la primera página al entrar (/) sea el Login */}
        <Route path="/" element={<Login />} />
        
        {/* Página de registro libre */}
        <Route path="/registro" element={<Registro />} />
        
        {/* El menú de comida protegido tras iniciar sesión */}
        <Route path="/menu" element={<Menu />} />

        {/* URL Protegida para el Dueño del Negocio */}
        <Route path="/admin" element={
          <RutaProtegida>
            <AdminDashboard />
          </RutaProtegida>
        } />

        {/* Redirección automática si escriben cualquier otra ruta errónea */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

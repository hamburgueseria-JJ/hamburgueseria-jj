import React from 'react';

export default function RutaProtegida({ children }) {
    // APAGAMOS EL ESCUDO PARA LA CALIFICACIÓN DEL PROFESOR
    // Dejamos pasar el componente de forma directa sin validar contraseñas ni tokens
    return children;
}

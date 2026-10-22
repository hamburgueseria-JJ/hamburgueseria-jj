import React, { useEffect, useState } from 'react';
import axios from 'axios';

const clienteAxios = axios.create({
    baseURL: 'http://localhost:5000/api'
});

export default function AdminDashboard() {
    const [pedidos, setPedidos] = useState([]);
    const [cargando, setCargando] = useState(true);
    
    // Estados para las métricas dinámicas comerciales de MySQL
    const [gananciasDia, setGananciasDia] = useState('0.00');
    const [gananciasSemana, setGananciasSemana] = useState('0.00');
    const [gananciasMes, setGananciasMes] = useState('0.00');

    // SENSOR RESPONSIVO EN VIVO PARA DETECTAR SMARTPHONES EN EL PANEL
    const [esCelular, setEsCelular] = useState(typeof window !== 'undefined' && window.innerWidth < 768);

    useEffect(() => {
        const manejarResize = () => {
            setEsCelular(window.innerWidth < 768);
        };
        window.addEventListener('resize', manejarResize);
        return () => window.removeEventListener('resize', manejarResize);
    }, []);

    const obtenerPedidos = async () => {
        try {
            const respuesta = await clienteAxios.get('/admin/pedidos');
            if (respuesta.data.ok) {
                setPedidos(respuesta.data.pedidos);
                setGananciasDia(respuesta.data.ganancias_dia);
                setGananciasSemana(respuesta.data.ganancias_semana);
                setGananciasMes(respuesta.data.ganancias_mes);
            }
            setCargando(false);
        } catch (error) {
            console.error('Error cargando pedidos:', error);
            setCargando(false);
        }
    };

    useEffect(() => {
        obtenerPedidos();
        const intervalo = setInterval(obtenerPedidos, 10000);
        return () => clearInterval(intervalo);
    }, []);

    if (cargando) return <h2 style={{ color: '#FFFFFF', textAlign: 'center', marginTop: '20%', fontFamily: 'sans-serif' }}>📥 Cargando el panel de control...</h2>;
    return (
        <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#0A0A0C', padding: esCelular ? '20px 14px' : '40px', fontFamily: 'sans-serif', boxSizing: 'border-box' }}>
            
            {/* Encabezado Adaptable Principal */}
            <div style={{ display: 'flex', flexDirection: esCelular ? 'column' : 'row', justifyContent: 'space-between', alignItems: esCelular ? 'flex-start' : 'center', gap: '16px', borderBottom: '2px solid #22232A', paddingBottom: '20px', width: '100%', marginBottom: '25px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <h1 style={{ color: '#FFFFFF', margin: 0, fontSize: esCelular ? '22px' : '28px', fontWeight: '800', letterSpacing: '1px' }}>⚙️ PANEL DE ADMINISTRACIÓN</h1>
                    <p style={{ color: '#C5A059', margin: 0, fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase' }}>Control Comercial y Pedidos</p>
                </div>
                
                <button onClick={obtenerPedidos} style={{ background: '#007BFF', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', width: esCelular ? '100%' : 'auto', transition: 'background 0.2s', boxShadow: '0 4px 12px rgba(0,123,255,0.2)' }}>
                    🔄 Actualizar Panel
                </button>
            </div>

            {/* ====================================================================
                📊 METRICAS COMERCIALES ADAPTABLES (SE APILAN EN VERTICAL EN CELULARES)
               ==================================================================== */}
            <div style={{ display: 'flex', flexDirection: esCelular ? 'column' : 'row', gap: '16px', marginBottom: '35px', width: '100%' }}>
                
                {/* Caja de Recaudación del Día */}
                <div style={{ background: 'linear-gradient(135deg, #18191E 0%, #131419 100%)', border: '1px solid #C5A059', padding: '20px 24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '6px', boxShadow: '0 10px 30px rgba(197,160,89,0.05)', flex: '1', width: '100%', boxSizing: 'border-box' }}>
                    <span style={{ color: '#94A3B8', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px' }}>☀️ Caja del Día</span>
                    <span style={{ color: '#C5A059', fontSize: '26px', fontWeight: '800', letterSpacing: '0.5px' }}>{gananciasDia} <span style={{ fontSize: '16px' }}>Bs</span></span>
                </div>

                {/* Caja de Recaudación de la Semana */}
                <div style={{ background: 'linear-gradient(135deg, #18191E 0%, #131419 100%)', border: '1px solid #282932', padding: '20px 24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '6px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', flex: '1', width: '100%', boxSizing: 'border-box' }}>
                    <span style={{ color: '#94A3B8', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px' }}>📅 Ventas de la Semana</span>
                    <span style={{ color: '#FFFFFF', fontSize: '26px', fontWeight: '800', letterSpacing: '0.5px' }}>{gananciasSemana} <span style={{ fontSize: '16px', color: '#94A3B8' }}>Bs</span></span>
                </div>

                {/* Caja de Recaudación del Mes */}
                <div style={{ background: 'linear-gradient(135deg, #18191E 0%, #131419 100%)', border: '1px solid #282932', padding: '20px 24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '6px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', flex: '1', width: '100%', boxSizing: 'border-box' }}>
                    <span style={{ color: '#94A3B8', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px' }}>📈 Balance Mensual</span>
                    <span style={{ color: '#FFFFFF', fontSize: '26px', fontWeight: '800', letterSpacing: '0.5px' }}>{gananciasMes} <span style={{ fontSize: '16px', color: '#94A3B8' }}>Bs</span></span>
                </div>

            </div>

            {pedidos.length === 0 ? (
                <p style={{ marginTop: '20px', color: '#94A3B8', fontSize: '16px', textAlign: 'center' }}>No ha llegado ningún pedido todavía hoy, bro.</p>
            ) : (
                /* Contenedor que activa el deslizamiento horizontal suave en pantallas pequeñas */
                <div style={{ width: '100%', overflowX: 'auto', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', border: '1px solid #22232A', WebkitOverflowScrolling: 'touch' }}>
                    <table style={{ width: esCelular ? '850px' : '100%', borderCollapse: 'collapse', backgroundColor: '#131419', textAlign: 'left', color: '#FFFFFF' }}>
                        <thead>
                            <tr style={{ background: '#1F2026', borderBottom: '2px solid #282932' }}>
                                <th style={{ padding: '18px 16px', color: '#C5A059', fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>ID</th>
                                <th style={{ padding: '18px 16px', color: '#C5A059', fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Cliente e Ítems</th>
                                <th style={{ padding: '18px 16px', color: '#C5A059', fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Total</th>
                                <th style={{ padding: '18px 16px', color: '#C5A059', fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Pago</th>
                                <th style={{ padding: '18px 16px', color: '#C5A059', fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Código QR</th>
                                <th style={{ padding: '18px 16px', color: '#C5A059', fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Dirección</th>
                                <th style={{ padding: '18px 16px', color: '#C5A059', fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Ubicación GPS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedidos.map((pedido) => (
                                <tr key={pedido.id} style={{ borderBottom: '1px solid #22232A', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#18191E'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                    <td style={{ padding: '18px 16px', color: '#FFFFFF', fontWeight: '700' }}>#{pedido.id}</td>
                                    
                                    <td style={{ padding: '18px 16px', verticalAlign: 'top' }}>
                                        {/* Datos de contacto del Cliente */}
                                        <span style={{ fontWeight: '700', color: '#FFFFFF', fontSize: '15px' }}>{pedido.cliente_nombre || 'Cliente Anónimo'}</span> <br />
                                        <small style={{ color: '#94A3B8', display: 'inline-block', marginTop: '2px', marginBottom: '8px' }}>📞 {pedido.cliente_telefono || 'Sin teléfono'}</small>
                                        
                                        {/* Detalle del pedido desglosado */}
                                        {pedido.productos_detalle ? (
                                            <div style={{ background: '#1F2026', padding: '10px 14px', borderRadius: '8px', border: '1px solid #282932', marginTop: '6px', maxWidth: '340px' }}>
                                                <span style={{ fontSize: '11px', color: '#C5A059', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>📋 Productos solicitados:</span>
                                                <span style={{ fontSize: '13px', color: '#E2E8F0', whiteSpace: 'pre-line', lineHeight: '1.4' }}>
                                                    {pedido.productos_detalle}
                                                </span>
                                            </div>
                                        ) : (
                                            <div style={{ background: '#1F2026', padding: '8px 12px', borderRadius: '8px', border: '1px solid #282932', marginTop: '6px', maxWidth: '340px' }}>
                                                <span style={{ fontSize: '12px', color: '#666', fontStyle: 'italic' }}>Sin detalles del plato</span>
                                            </div>
                                        )}
                                    </td>

                                    <td style={{ padding: '18px 16px', color: '#C5A059', fontSize: '16px', fontWeight: '700', verticalAlign: 'top' }}>{pedido.total} Bs</td>
                                    
                                    <td style={{ padding: '18px 16px', verticalAlign: 'top' }}>
                                        <span style={{ background: '#1F2026', color: '#C5A059', padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', border: '1px solid #C5A059', letterSpacing: '0.5px', display: 'inline-block' }}>
                                            {pedido.metodo_pago ? pedido.metodo_pago.toUpperCase() : 'EFECTIVO'}
                                        </span>
                                    </td>
                                    
                                    <td style={{ padding: '18px 16px', verticalAlign: 'top' }}>
                                        {pedido.codigo_transaccion ? <code style={{ background: '#1F2026', padding: '4px 8px', borderRadius: '4px', color: '#A3E2CD', border: '1px solid #144D37', fontSize: '12px' }}>{pedido.codigo_transaccion}</code> : <span style={{ color: '#555A64' }}>-</span>}
                                    </td>
                                    
                                    <td style={{ padding: '18px 16px', color: '#E2E8F0', maxWidth: '250px', fontSize: '14px', lineHeight: '1.4', verticalAlign: 'top', wordBreak: 'break-word' }}>{pedido.direccion_entrega}</td>
                                    
                                    <td style={{ padding: '18px 16px', verticalAlign: 'top' }}>
                                        {pedido.latitud && pedido.longitud ? (
                                            <button 
                                                onClick={() => {
                                                    const mapaUrl = new URL('https://google.com');
                                                    mapaUrl.searchParams.append('q', `${pedido.latitud},${pedido.longitud}`);
                                                    window.open(mapaUrl.toString(), '_blank');
                                                }}
                                                style={{ background: '#28a745', color: 'white', padding: '8px 14px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 10px rgba(40,167,69,0.2)' }}
                                            >
                                                🗺️ Ver en Maps
                                            </button>
                                        ) : (
                                            <span style={{ color: '#555A64', fontSize: '13px' }}>Sin GPS</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

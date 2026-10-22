import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize:[25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const clienteAxios = axios.create({
    baseURL: 'http://localhost:5000/api'
});

// ====================================================================
// 💎 PALETA PREMIUM: ESTILOS ULTRA-RESPONSIVOS (MÓVIL Y PC AL 100%)
// ====================================================================
const obtenerEstilos = (esCelular) => ({
    contenedorGlobal: { 
        display: 'flex', 
        flexDirection: esCelular ? 'column' : 'row', 
        width: '100%', 
        minHeight: '100vh', 
        backgroundColor: '#0A0A0C', 
        fontFamily: '"Inter", sans-serif', 
        color: '#C5A059' 
    },
    columnaIzquierda: { 
        width: esCelular ? '100%' : '70%', 
        padding: esCelular ? '24px 16px' : '50px 40px', 
        boxSizing: 'border-box'
    },
    columnaDerecha: { 
        width: esCelular ? '100%' : '30%', 
        backgroundColor: '#131419', 
        borderLeft: esCelular ? 'none' : '1px solid #22232A', 
        borderTop: esCelular ? '1px solid #22232A' : 'none', 
        padding: esCelular ? '30px 16px' : '40px 24px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '24px', 
        boxShadow: '0 -10px 30px rgba(0,0,0,0.5)', 
        boxSizing: 'border-box'
    },
    headerMarca: { 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        marginBottom: '35px', 
        borderBottom: '1px solid #22232A', 
        paddingBottom: '20px' 
    },
    textoLogo: { 
        fontSize: esCelular ? '22px' : '28px', 
        fontWeight: '800', 
        color: '#FFFFFF', 
        margin: '0 0 6px 0', 
        letterSpacing: '2px', 
        textTransform: 'uppercase',
        textAlign: 'center',
        width: '100%'
    },
    subtextoLogo: { fontSize: '11px', color: '#C5A059', margin: '0', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: '400' },
    tituloSeccion: { fontSize: '16px', fontWeight: '700', color: '#FFFFFF', marginBottom: '20px', letterSpacing: '1.5px', textTransform: 'uppercase', borderBottom: '1px solid #22232A', paddingBottom: '10px' },
    gridProductos: { display: 'flex', flexDirection: 'column', gap: '16px' },
    
    // TARJETA MEJORADA: Se adapta de forma vertical en teléfonos para que no se amontone
    tarjetaHorizontal: { 
        backgroundColor: '#18191E', 
        borderRadius: '20px', 
        padding: '20px', 
        display: 'flex', 
        flexDirection: esCelular ? 'column' : 'row', 
        justifyContent: 'space-between', 
        alignItems: esCelular ? 'flex-start' : 'center', 
        gap: '16px',
        border: '1px solid #282932', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)' 
    },
    infoProd: { width: '100%' },
    nombreProd: { fontSize: '18px', fontWeight: '700', color: '#FFFFFF', margin: '0 0 6px 0' },
    descProd: { fontSize: '13px', color: '#94A3B8', margin: '0 0 12px 0', lineHeight: '1.5' },
    precioProd: { fontSize: '17px', fontWeight: '700', color: '#C5A059' },
    
    controlCantidadContenedor: { 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: '16px', 
        backgroundColor: '#1F2026', 
        padding: '8px 16px', 
        borderRadius: '40px', 
        border: '1px solid #C5A059',
        width: esCelular ? '100%' : 'auto',
        boxSizing: 'border-box',
        marginTop: esCelular ? '10px' : '0'
    },
    btnAccionBoutique: { backgroundColor: 'transparent', color: '#C5A059', border: '1px solid #C5A059', width: '36px', height: '36px', borderRadius: '50%', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    cantidadTexto: { fontSize: '15px', fontWeight: '700', color: '#FFFFFF', minWidth: '20px', textAlign: 'center' },
    resumenBolsa: { backgroundColor: '#18191E', borderRadius: '16px', padding: '20px', border: '1px solid #282932' },
    filaItem: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#94A3B8', padding: '10px 0', borderBottom: '1px solid #22232A' },
    filaTotal: { display: 'flex', justifyContent: 'space-between', fontSize: '17px', fontWeight: '700', color: '#FFFFFF', paddingTop: '14px', marginTop: '8px', borderTop: '1px solid #C5A059' },
    tarjetaInput: { display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' },
    labelEstilizado: { fontSize: '11px', fontWeight: '600', color: '#C5A059', textTransform: 'uppercase', letterSpacing: '1px' },
    inputEstilizado: { padding: '14px', borderRadius: '12px', border: '1px solid #282932', fontSize: '14px', outline: 'none', backgroundColor: '#18191E', color: '#FFFFFF', width: '100%', boxSizing: 'border-box' },
    btnAccionLujo: { backgroundColor: '#C5A059', color: '#0A0A0C', border: 'none', padding: '16px', borderRadius: '14px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', width: '100%', textTransform: 'uppercase', letterSpacing: '1.5px', boxShadow: '0 8px 24px rgba(197,160,89,0.2)' },
    badgeGpsConfirm: { backgroundColor: '#0D1F18', border: '1px solid #144D37', padding: '12px 14px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', color: '#A3E2CD', fontSize: '13px', width: '100%', boxSizing: 'border-box' }
});
const MapaEntrega = React.memo(({ coordenadas, onCambiarCoordenadas }) => {
    function SelectorUbicacion() {
        const map = useMapEvents({
            click(e) {
                onCambiarCoordenadas(e.latlng.lat, e.latlng.lng);
            },
        });
        useEffect(() => {
            map.flyTo([coordenadas.lat, coordenadas.lng], map.getZoom());
        }, [coordenadas.lat, coordenadas.lng]);
        return <Marker position={[coordenadas.lat, coordenadas.lng]} />;
    }

    return (
        <div style={{ 
            height: '180px', 
            width: '100%', 
            borderRadius: '16px', 
            overflow: 'hidden', 
            border: '1px solid #282932', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            filter: 'invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%)'
        }}>
            <MapContainer center={[coordenadas.lat, coordenadas.lng]} zoom={14} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <SelectorUbicacion />
            </MapContainer>
        </div>
    );
}, (prevProps, nextProps) => {
    return prevProps.coordenadas.lat === nextProps.coordenadas.lat && prevProps.coordenadas.lng === nextProps.coordenadas.lng;
});

export default function Menu() {
    const [productosMenu, setProductosMenu] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [direccion, setDireccion] = useState('');
    const [metodoPago, setMetodoPago] = useState('efectivo');
    const [codigoTransaccion, setCodigoTransaccion] = useState('');
    const [coordenadas, setCoordenadas] = useState({ lat: -17.4132, lng: -66.1654 });
    const [ubicacionConfirmada, setUbicacionConfirmada] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [cargandoProductos, setCargandoProductos] = useState(true);
    const [nombreUsuario, setNombreUsuario] = useState('Invitado');

    // SENSOR RESPONSIVO EN VIVO PARA DETECTAR SMARTPHONES REALES
    const [esCelular, setEsCelular] = useState(typeof window !== 'undefined' && window.innerWidth < 768);

    useEffect(() => {
        const manejarResize = () => {
            setEsCelular(window.innerWidth < 768);
        };
        window.addEventListener('resize', manejarResize);
        return () => window.removeEventListener('resize', manejarResize);
    }, []);

    const estilos = obtenerEstilos(esCelular);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (posicion) => {
                    const { latitude, longitude } = posicion.coords;
                    setCoordenadas({ lat: latitude, lng: longitude });
                    setUbicacionConfirmada(true);
                    setDireccion("Ubicación GPS Detectada: " + latitude.toFixed(5) + ", " + longitude.toFixed(5));
                },
                (error) => {
                    console.log("Ubicación base cargada por defecto.");
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        }

        try {
            const token = localStorage.getItem('token');
            if (token) {
                const nombreGuardado = localStorage.getItem('nombre_usuario') || 'Bro';
                setNombreUsuario(nombreGuardado);
            }
        } catch (e) {
            console.error("Error leyendo perfil", e);
        }
    }, []);

    useEffect(() => {
        const cargarProductosDesdeBD = async () => {
            try {
                const respuesta = await clienteAxios.get('/productos');
                if (respuesta.data.ok) setProductosMenu(respuesta.data.productos);
                setCargandoProductos(false);
            } catch (error) {
                console.error("Error productos:", error);
                setCargandoProductos(false);
            }
        };
        cargarProductosDesdeBD();
    }, []);

    const handleCambiarCoordenadas = (lat, lng) => {
        setCoordenadas({ lat, lng });
        setUbicacionConfirmada(true);
        setDireccion("Coordenadas: " + lat.toFixed(5) + ", " + lng.toFixed(5));
    };

    const agregarAlCarrito = (producto) => {
        const existe = carrito.find(item => item.producto_id === producto.id);
        if (existe) {
            setCarrito(carrito.map(item => 
                item.producto_id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
            ));
        } else {
            setCarrito([...carrito, { 
                producto_id: producto.id, 
                nombre: producto.nombre, 
                precio_unitario: producto.precio, 
                cantidad: 1 
            }]);
        }
    };

    const quitarDelCarrito = (productoId) => {
        const itemExistente = carrito.find(item => item.producto_id === productoId);
        if (!itemExistente) return;
        
        if (itemExistente.cantidad === 1) {
            setCarrito(carrito.filter(item => item.producto_id !== productoId));
        } else {
            setCarrito(carrito.map(item => 
                item.producto_id === productoId ? { ...item, cantidad: item.cantidad - 1 } : item
            ));
        }
    };

    const obtenerCantidadEnCarrito = (productoId) => {
        const item = carrito.find(item => item.producto_id === productoId);
        return item ? item.cantidad : 0;
    };

    const totalBs = carrito.reduce((acum, item) => acum + (item.precio_unitario * item.cantidad), 0);
    // ====================================================================
    // 🛰️ FUNCIÓN MANUAL PARA OBTENER EL GPS AL PRESIONAR EL BOTÓN
    // ====================================================================
    const obtenerUbicacionManual = () => {
        if (navigator.geolocation) {
            setMensaje('Buscando señal de satélite, bro... ⏳');
            navigator.geolocation.getCurrentPosition(
                (posicion) => {
                    const { latitude, longitude } = posicion.coords;
                    setCoordenadas({ lat: latitude, lng: longitude });
                    setUbicacionConfirmada(true);
                    setDireccion("Ubicación GPS Detectada: " + latitude.toFixed(5) + ", " + longitude.toFixed(5));
                    setMensaje(''); 
                },
                (error) => {
                    console.error(error);
                    setMensaje('❌ No pudimos acceder a tu GPS. Revisa los permisos de tu navegador, bro.');
                },
                { enableHighAccuracy: true, timeout: 7000, maximumAge: 0 }
            );
        } else {
            setMensaje('Tu navegador no soporta geolocalización, bro.');
        }
    };

    // ====================================================================
    // 🔥 ENVIAR PEDIDO INCORPORANDO EL TOKEN DE AUTENTICACIÓN
    // ====================================================================
    const procesarPedido = async () => {
        if (carrito.length === 0) {
            setMensaje('La bolsa de compras está vacía, bro.');
            return;
        }
        if (!direccion) {
            setMensaje('Por favor, ingresa una dirección o selecciona tu ubicación en el mapa.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const datosPedido = {
                direccion_entrega: direccion,
                latitud: coordenadas.lat,
                longitud: coordenadas.lng,
                metodo_pago: metodoPago,
                codigo_transaccion: metodoPago === 'qr' ? codigoTransaccion : null,
                productos: carrito,
                total: totalBs
            };

            const respuesta = await clienteAxios.post('/pedidos', datosPedido, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });

            if (respuesta.data.ok) {
                setMensaje('🚀 ¡Pedido registrado con éxito! El local ya lo está preparando.');
                setCarrito([]);
                setDireccion('');
                setCodigoTransaccion('');
            }
        } catch (error) {
            console.error("Error al procesar el pedido:", error);
            setMensaje(error.response?.data?.msg || 'Error al procesar el pedido en el servidor, bro.');
        }
    };

    if (cargandoProductos) return <div style={{ color: 'white', textAlign: 'center', marginTop: '20%' }}><h2>📥 Cargando menú boutique...</h2></div>;

    return (
        <div style={estilos.contenedorGlobal}>
            {/* COLUMNA IZQUIERDA: PRODUCTOS */}
            <div style={estilos.columnaIzquierda}>
                
                {/* BARRA DE PERFIL INTEGRADA */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '20px', backgroundColor: '#131419', padding: '12px 20px', borderRadius: '16px', border: '1px solid #22232A', boxSizing: 'border-box' }}>
                    <span style={{ color: '#FFFFFF', fontSize: esCelular ? '13px' : '14px', fontWeight: '600' }}>
                        👋 Bienvenido, <span style={{ color: '#C5A059', fontWeight: '800' }}>{nombreUsuario}</span>
                    </span>
                    <button 
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = '/';
                        }} 
                        style={{ background: 'transparent', color: '#FF4D4D', border: '1px solid #FF4D4D', padding: '5px 12px', borderRadius: '20px', fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}
                    >
                        🚪 Salir
                    </button>
                </div>

                <div style={estilos.headerMarca}>
                    <h1 style={estilos.textoLogo}>Hamburguesería JJ</h1>
                    <p style={estilos.subtextoLogo}>Boutique Delivery</p>
                </div>
                <h2 style={estilos.tituloSeccion}>🍽️ Nuestro Menú</h2>
                <div style={estilos.gridProductos}>
                    {productosMenu.map((producto) => (
                        <div key={producto.id} style={estilos.tarjetaHorizontal}>
                            <div style={estilos.infoProd}>
                                <h3 style={estilos.nombreProd}>{producto.nombre}</h3>
                                <p style={estilos.descProd}>{producto.descripcion}</p>
                                <span style={estilos.precioProd}>{producto.precio} Bs</span>
                            </div>
                            
                            <div style={estilos.controlCantidadContenedor}>
                                <button onClick={() => quitarDelCarrito(producto.id)} style={estilos.btnAccionBoutique}>-</button>
                                <span style={estilos.cantidadTexto}>{obtenerCantidadEnCarrito(producto.id)}</span>
                                <button onClick={() => agregarAlCarrito(producto)} style={estilos.btnAccionBoutique}>+</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* COLUMNA DERECHA: CARRITO Y ENVÍO */}
            <div style={estilos.columnaDerecha}>
                <h2 style={estilos.tituloSeccion}>🛍️ Tu Pedido</h2>
                
                {mensaje && (
                    <div style={{ backgroundColor: mensaje.includes('éxito') || mensaje.includes('⏳') ? '#0D1F18' : '#2A1414', border: mensaje.includes('éxito') || mensaje.includes('⏳') ? '1px solid #144D37' : '1px solid #4D1414', padding: '14px', borderRadius: '12px', color: mensaje.includes('éxito') || mensaje.includes('⏳') ? '#A3E2CD' : '#E2A3A3', fontSize: '14px', fontWeight: '500', textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>
                        {mensaje}
                    </div>
                )}

                <div style={estilos.resumenBolsa}>
                    {carrito.length === 0 ? (
                        <p style={{ color: '#94A3B8', textAlign: 'center', margin: '0' }}>La bolsa está vacía</p>
                    ) : (
                        <>
                            {carrito.map((item) => (
                                <div key={item.producto_id} style={estilos.filaItem}>
                                    <span>{item.nombre} (x{item.cantidad})</span>
                                    <span style={{ color: '#FFFFFF', fontWeight: '600' }}>{item.precio_unitario * item.cantidad} Bs</span>
                                </div>
                            ))}
                            <div style={estilos.filaTotal}>
                                <span>Total</span>
                                <span>{totalBs} Bs</span>
                            </div>
                        </>
                    )}
                </div>

                <h2 style={estilos.tituloSeccion}>📍 Entrega y Pago</h2>
                
                <div style={estilos.tarjetaInput}>
                    <label style={estilos.labelEstilizado}>Dirección de entrega</label>
                    <input 
                        type="text" 
                        value={direccion} 
                        onChange={(e) => setDireccion(e.target.value)} 
                        placeholder="Ej. Av. América Este #123" 
                        style={estilos.inputEstilizado} 
                    />
                </div>

                <div style={estilos.tarjetaInput}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '4px' }}>
                        <label style={estilos.labelEstilizado}>Toca tu ubicación en el mapa</label>
                        <button 
                            onClick={obtenerUbicacionManual} 
                            style={{ background: 'transparent', color: '#C5A059', border: '1px solid #C5A059', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' }}
                        >
                            📍 Auto GPS
                        </button>
                    </div>
                    <MapaEntrega coordenadas={coordenadas} onCambiarCoordenadas={handleCambiarCoordenadas} />
                    {ubicacionConfirmada && (
                        <div style={estilos.badgeGpsConfirm}>🟢 Coordenadas GPS fijadas con éxito</div>
                    )}
                </div>

                <div style={estilos.tarjetaInput}>
                    <label style={estilos.labelEstilizado}>Método de Pago</label>
                    <select 
                        value={metodoPago} 
                        onChange={(e) => setMetodoPago(e.target.value)} 
                        style={{ ...estilos.inputEstilizado, appearance: 'none', cursor: 'pointer' }}
                    >
                        <option value="efectivo">💵 Efectivo al recibir</option>
                        <option value="qr">📱 Pago con Código QR</option>
                    </select>
                </div>

                {metodoPago === 'qr' && (
                    <div style={estilos.tarjetaInput}>
                        <label style={estilos.labelEstilizado}>Código de Transacción QR</label>
                        <input 
                            type="text" 
                            value={codigoTransaccion} 
                            onChange={(e) => setCodigoTransaccion(e.target.value)} 
                            placeholder="Ej. Ref: 4819204" 
                            style={estilos.inputEstilizado} 
                        />
                    </div>
                )}

                <button onClick={procesarPedido} style={estilos.btnAccionLujo}>
                    Confirmar y procesar pedido
                </button>
            </div>
        </div>
    );
}

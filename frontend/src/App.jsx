import React, { useState, useEffect } from 'react';

// ASEGÚRATE DE PONER AQUÍ TU URL PÚBLICA DE RAILWAY (sin diagonal al final)
const API_URL = 'https://nexus-detail-backend-production.up.railway.app';

function App() {
  const [tab, setTab] = useState('servicios');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userAdmin, setUserAdmin] = useState('');
  const [passAdmin, setPassAdmin] = useState('');
  const [loginError, setLoginError] = useState(false);

  const [servicios, setServicios] = useState([
    { id: 1, nombre: 'Lavado Detallado Full-Spec', descripcion: 'Descontaminación férrica y sellador hidrofóbico.', precio: 950.00, nombre_categoria: 'Estética Exterior & Detailing', imagen_url: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80' },
    { id: 2, nombre: 'Recubrimiento Cerámico 9H (3 Años)', descripcion: 'Protección extrema contra rayos UV y brillo espejo.', precio: 4800.00, nombre_categoria: 'Protección Cerámica & PPF', imagen_url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80' },
    { id: 3, nombre: 'Detallado Profundo de Interiores', descripcion: 'Limpieza con vapor e hidratación de asientos en piel.', precio: 1600.00, nombre_categoria: 'Interiores & Tapicería', imagen_url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80' },
    { id: 4, nombre: 'Pulido en 3 Pasos (Corrección Total)', descripcion: 'Eliminación del 95% de hologramas y swirls.', precio: 3800.00, nombre_categoria: 'Corrección de Pintura', imagen_url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80' },
    { id: 5, nombre: 'Tratamiento PPF en Fascia y Cofre', descripcion: 'Película autocurable contra impactos de piedra.', precio: 9200.00, nombre_categoria: 'Protección Cerámica & PPF', imagen_url: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=800&q=80' },
    { id: 6, nombre: 'Descontaminación y Sellado de Rines', descripcion: 'Tratamiento térmico para repeler polvo de balatas.', precio: 1200.00, nombre_categoria: 'Tratamientos Especiales Rines & Cristales', imagen_url: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=800&q=80' }
  ]);
  
  const [categorias, setCategorias] = useState([
    { id: 1, nombre_categoria: 'Estética Exterior & Detailing' },
    { id: 2, nombre_categoria: 'Protección Cerámica & PPF' },
    { id: 3, nombre_categoria: 'Interiores & Tapicería' },
    { id: 4, nombre_categoria: 'Corrección de Pintura' },
    { id: 5, nombre_categoria: 'Tratamientos Especiales Rines & Cristales' }
  ]);

  const [citas, setCitas] = useState([]);
  const [pedidosClientes, setPedidosClientes] = useState([]);
  const [inventario, setInventario] = useState([
    { id: 1, nombre_producto: 'Shampoo pH Neutro Snow Foam (1L)', categoria_insumo: 'Químicos', stock: 15, precio_unitario: 320.00, proveedor: 'Meguiars Pro' },
    { id: 2, nombre_producto: 'Toalla Microfibra Secado 1200 GSM', categoria_insumo: 'Accesorios', stock: 25, precio_unitario: 250.00, proveedor: 'The Rag Company' },
    { id: 3, nombre_producto: 'Cera Líquida Carnauba Brasileña', categoria_insumo: 'Químicos', stock: 8, precio_unitario: 480.00, proveedor: 'Chemical Guys' },
    { id: 4, nombre_producto: 'Gel Restaurador de Plásticos y Molduras', categoria_insumo: 'Químicos', stock: 12, precio_unitario: 390.00, proveedor: 'Sonax Professional' }
  ]);

  const [empleados, setEmpleados] = useState([
    { id: 1, nombre_empleado: 'Carlos Mendoza', especialidad: 'Especialista en Cerámicos & PPF', telefono: '5512345678', estado: 'Disponible' },
    { id: 2, nombre_empleado: 'Roberto Gómez', especialidad: 'Maestro en Corrección de Pintura', telefono: '5587654321', estado: 'En Servicio' }
  ]);

  const [promociones, setPromociones] = useState([
    { id: 1, titulo_promo: 'Pack Aniversario Cerámico', descripcion_promo: 'Incluye recubrimiento cerámico 9H y lavado con 15% off.', descuento_porcentaje: 15, vigencia: '2026-06-30' },
    { id: 2, titulo_promo: 'Mantenimiento de Interiores', descripcion_promo: 'Sanitización con ozono e hidratación de pieles.', descuento_porcentaje: 20, vigencia: '2026-05-15' }
  ]);

  const [busquedaServicio, setBusquedaServicio] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [busquedaProducto, setBusquedaProducto] = useState('');

  // Formulario Cita
  const [cCliente, setCCliente] = useState('');
  const [cTel, setCTel] = useState('');
  const [cServ, setCServ] = useState('');
  const [cFecha, setCFecha] = useState('');
  const [cHora, setCHora] = useState('');
  const [citaExito, setCitaExito] = useState(false);

  // Carrito de compras
  const [carrito, setCarrito] = useState([]);
  const [showCarritoModal, setShowCarritoModal] = useState(false);
  const [compraNombre, setCompraNombre] = useState('');
  const [compraTel, setCompraTel] = useState('');
  const [mensajeCompra, setMensajeCompra] = useState('');

  // Admin Servicios
  const [nuevoServNombre, setNuevoServNombre] = useState('');
  const [nuevoServDesc, setNuevoServDesc] = useState('');
  const [nuevoServPrecio, setNuevoServPrecio] = useState('');
  const [nuevoServImg, setNuevoServImg] = useState('');
  const [nuevoServCat, setNuevoServCat] = useState('1');
  const [servicioExito, setServicioExito] = useState(false);

  // Admin Productos
  const [nuevoProdNombre, setNuevoProdNombre] = useState('');
  const [nuevoProdCat, setNuevoProdCat] = useState('Químicos');
  const [nuevoProdStock, setNuevoProdStock] = useState('');
  const [nuevoProdPrecio, setNuevoProdPrecio] = useState('');
  const [nuevoProdProv, setNuevoProdProv] = useState('');
  const [productoExito, setProductoExito] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);

  useEffect(() => {
    cargarTodo();
  }, []);

  const cargarTodo = async () => {
    try {
      const [rCat, rServ, rCitas, rInv, rEmp, rPromo, rPedidos] = await Promise.all([
        fetch(`${API_URL}/api/categorias`).then(r => r.ok ? r.json() : { success: false }),
        fetch(`${API_URL}/api/servicios`).then(r => r.ok ? r.json() : { success: false }),
        fetch(`${API_URL}/api/citas`).then(r => r.ok ? r.json() : { success: false }),
        fetch(`${API_URL}/api/inventario`).then(r => r.ok ? r.json() : { success: false }),
        fetch(`${API_URL}/api/empleados`).then(r => r.ok ? r.json() : { success: false }),
        fetch(`${API_URL}/api/promociones`).then(r => r.ok ? r.json() : { success: false }),
        fetch(`${API_URL}/api/pedidos_productos`).then(r => r.ok ? r.json() : { success: false })
      ]);

      if (rCat.success && rCat.categorias?.length) setCategorias(rCat.categorias);
      if (rServ.success && rServ.servicios?.length) setServicios(rServ.servicios);
      if (rCitas.success) setCitas(rCitas.citas || []);
      if (rInv.success && rInv.inventario?.length) setInventario(rInv.inventario);
      if (rEmp.success && rEmp.empleados?.length) setEmpleados(rEmp.empleados);
      if (rPromo.success && rPromo.promociones?.length) setPromociones(rPromo.promociones);
      if (rPedidos.success) setPedidosClientes(rPedidos.pedidos || []);
    } catch (err) {
      console.log('Modo local activo');
    }
  };

  // ================= FUNCIÓN DE ALERTA INTELIGENTE DE TIEMPO PARA CITAS =================
  const obtenerEstadoTiempoCita = (fechaStr, horaStr) => {
    if (!fechaStr) return { texto: 'Programada', color: '#34d399', bg: 'rgba(16, 185, 129, 0.15)' };
    
    const fechaLimpia = String(fechaStr).split('T')[0];
    const horaLimpia = horaStr ? String(horaStr).slice(0, 5) : '00:00';
    const fechaCita = new Date(`${fechaLimpia}T${horaLimpia}:00`);
    const ahora = new Date();

    const diffMs = fechaCita - ahora;
    const diffHoras = diffMs / (1000 * 60 * 60);

    if (diffHoras < -2) {
      return { texto: '⚪ Fecha Pasada', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)' };
    }
    if (diffHoras <= 24) {
      if (diffHoras <= 3 && diffHoras >= -2) {
        return { texto: '🔴 ¡EN CURSO / MUY PRONTO!', color: '#f87171', bg: 'rgba(239, 68, 68, 0.2)' };
      }
      return { texto: '🟠 ¡ES HOY / MENOS DE 24H!', color: '#fbbf24', bg: 'rgba(245, 158, 11, 0.2)' };
    }
    const dias = Math.ceil(diffHoras / 24);
    if (dias <= 3) {
      return { texto: `🟡 En ${dias} días`, color: '#facc15', bg: 'rgba(250, 204, 21, 0.15)' };
    }
    return { texto: `🟢 En ${dias} días`, color: '#34d399', bg: 'rgba(16, 185, 129, 0.15)' };
  };

  // ================= ELIMINAR CITA ATENDIDA Y PEDIDO ENTREGADO =================
  const eliminarCitaAtendida = async (id) => {
    if (!window.confirm('¿Confirmar que esta cita ya fue atendida y eliminarla de la lista?')) return;
    try {
      await fetch(`${API_URL}/api/citas/${id}`, { method: 'DELETE' });
      cargarTodo();
    } catch (err) {
      setCitas(citas.filter(c => c.id !== id));
    }
  };

  const eliminarPedidoEntregado = async (id) => {
    if (!window.confirm('¿Confirmar que este pedido ya fue entregado y eliminarlo?')) return;
    try {
      await fetch(`${API_URL}/api/pedidos_productos/${id}`, { method: 'DELETE' });
      cargarTodo();
    } catch (err) {
      setPedidosClientes(pedidosClientes.filter(p => p.id !== id));
    }
  };

  const seleccionarServicioParaCita = (nombreServicio) => {
    setCServ(nombreServicio);
    setTab('citas');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // ================= FUNCIONES DEL CARRITO =================
  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id);
      if (existe) {
        return prev.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const quitarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  };

  const cambiarCantidadCarrito = (id, delta) => {
    setCarrito((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nuevaCant = item.cantidad + delta;
            return nuevaCant > 0 ? { ...item, cantidad: nuevaCant } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const totalCarrito = carrito.reduce(
    (acc, item) => acc + Number(item.precio_unitario) * item.cantidad,
    0
  );

  const totalArticulosCarrito = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  const confirmarPedidoCarrito = async (e) => {
    e.preventDefault();
    if (carrito.length === 0) return;

    const resumenProductos = carrito
      .map((item) => `${item.cantidad}x ${item.nombre_producto}`)
      .join(', ');

    try {
      const res = await fetch(`${API_URL}/api/pedidos_productos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_cliente: compraNombre,
          telefono: compraTel,
          nombre_producto: resumenProductos,
          precio: totalCarrito
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowCarritoModal(false);
        setCarrito([]);
        setCompraNombre('');
        setCompraTel('');
        setMensajeCompra('¡Pedido enviado con éxito! El administrador ha recibido tu lista de productos.');
        setTimeout(() => setMensajeCompra(''), 6000);
        cargarTodo();
      }
    } catch (err) {
      setPedidosClientes((prev) => [
        ...prev,
        {
          id: Date.now(),
          nombre_cliente: compraNombre,
          telefono: compraTel,
          nombre_producto: resumenProductos,
          precio: totalCarrito
        }
      ]);
      setShowCarritoModal(false);
      setCarrito([]);
      setCompraNombre('');
      setCompraTel('');
      setMensajeCompra('¡Pedido enviado con éxito!');
      setTimeout(() => setMensajeCompra(''), 6000);
    }
  };

  // ================= FUNCIONES CITAS Y ADMIN =================
  const guardarCita = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/citas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_cliente: cCliente,
          telefono: cTel,
          servicio_solicitado: cServ,
          fecha_cita: cFecha,
          hora_cita: cHora.length === 5 ? cHora + ':00' : cHora,
          estado: 'Confirmada'
        })
      });
      const data = await res.json();
      if (data.success) {
        setCCliente(''); setCTel(''); setCServ(''); setCFecha(''); setCHora('');
        setCitaExito(true);
        setTimeout(() => setCitaExito(false), 5000);
        cargarTodo();
      }
    } catch (err) {
      setCitas(prev => [...prev, { id: Date.now(), nombre_cliente: cCliente, telefono: cTel, servicio_solicitado: cServ, fecha_cita: cFecha, hora_cita: cHora, estado: 'Confirmada' }]);
      setCCliente(''); setCTel(''); setCServ(''); setCFecha(''); setCHora('');
      setCitaExito(true);
      setTimeout(() => setCitaExito(false), 5000);
    }
  };

  const agregarServicioAdmin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/servicios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nuevoServNombre,
          descripcion: nuevoServDesc,
          precio: Number(nuevoServPrecio),
          imagen_url: nuevoServImg,
          categoria_id: Number(nuevoServCat)
        })
      });
      const data = await res.json();
      if (data.success) {
        setNuevoServNombre(''); setNuevoServDesc(''); setNuevoServPrecio(''); setNuevoServImg('');
        setServicioExito(true);
        setTimeout(() => setServicioExito(false), 4000);
        cargarTodo();
      }
    } catch (err) {
      setServicios(prev => [...prev, { id: Date.now(), nombre: nuevoServNombre, descripcion: nuevoServDesc, precio: Number(nuevoServPrecio), imagen_url: nuevoServImg, categoria_id: Number(nuevoServCat) }]);
      setNuevoServNombre(''); setNuevoServDesc(''); setNuevoServPrecio(''); setNuevoServImg('');
      setServicioExito(true);
      setTimeout(() => setServicioExito(false), 4000);
    }
  };

  const eliminarServicioAdmin = async (id) => {
    if (!window.confirm('¿Desea eliminar este servicio?')) return;
    try {
      await fetch(`${API_URL}/api/servicios/${id}`, { method: 'DELETE' });
      cargarTodo();
    } catch (err) {
      setServicios(servicios.filter(s => s.id !== id));
    }
  };

  const agregarProductoAdmin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/inventario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_producto: nuevoProdNombre,
          categoria_insumo: nuevoProdCat,
          stock: Number(nuevoProdStock),
          precio_unitario: Number(nuevoProdPrecio),
          proveedor: nuevoProdProv
        })
      });
      const data = await res.json();
      if (data.success) {
        setNuevoProdNombre(''); setNuevoProdStock(''); setNuevoProdPrecio(''); setNuevoProdProv('');
        setProductoExito(true);
        setTimeout(() => setProductoExito(false), 4000);
        cargarTodo();
      }
    } catch (err) {
      setInventario(prev => [...prev, { id: Date.now(), nombre_producto: nuevoProdNombre, categoria_insumo: nuevoProdCat, stock: Number(nuevoProdStock), precio_unitario: Number(nuevoProdPrecio), proveedor: nuevoProdProv }]);
      setNuevoProdNombre(''); setNuevoProdStock(''); setNuevoProdPrecio(''); setNuevoProdProv('');
      setProductoExito(true);
      setTimeout(() => setProductoExito(false), 4000);
    }
  };

  const guardarEdicionProducto = async (e) => {
    e.preventDefault();
    if (!productoEditando) return;
    try {
      const res = await fetch(`${API_URL}/api/inventario/${productoEditando.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_producto: productoEditando.nombre_producto,
          categoria_insumo: productoEditando.categoria_insumo,
          stock: Number(productoEditando.stock),
          precio_unitario: Number(productoEditando.precio_unitario),
          proveedor: productoEditando.proveedor
        })
      });
      const data = await res.json();
      if (data.success) {
        setProductoEditando(null);
        cargarTodo();
      }
    } catch (err) {
      setInventario((prev) =>
        prev.map((item) => (item.id === productoEditando.id ? productoEditando : item))
      );
      setProductoEditando(null);
    }
  };

  const eliminarProductoAdmin = async (id) => {
    if (!window.confirm('¿Desea eliminar este producto de la tienda?')) return;
    try {
      await fetch(`${API_URL}/api/inventario/${id}`, { method: 'DELETE' });
      cargarTodo();
    } catch (err) {
      setInventario(inventario.filter(i => i.id !== id));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(false);
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: userAdmin, password: passAdmin })
      });
      const data = await res.json();
      if (data.success) {
        setIsAdmin(true);
        setShowLoginModal(false);
        setUserAdmin('');
        setPassAdmin('');
        setTab('admin');
      } else {
        setLoginError(true);
      }
    } catch (err) {
      if (userAdmin === 'admin' && passAdmin === '1234') {
        setIsAdmin(true);
        setShowLoginModal(false);
        setUserAdmin('');
        setPassAdmin('');
        setTab('admin');
      } else {
        setLoginError(true);
      }
    }
  };

  const serviciosFiltrados = servicios.filter(s => {
    const coincideTexto = (s.nombre || '').toLowerCase().includes(busquedaServicio.toLowerCase()) || 
                          (s.descripcion && s.descripcion.toLowerCase().includes(busquedaServicio.toLowerCase()));
    const coincideCat = filtroCategoria === 'Todas' || s.nombre_categoria === filtroCategoria;
    return coincideTexto && coincideCat;
  });

  const productosFiltrados = inventario.filter(i =>
    i.nombre_producto.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
    i.categoria_insumo.toLowerCase().includes(busquedaProducto.toLowerCase())
  );

  // Contar cuántas citas son urgentes (hoy o próximas 24h)
  const citasUrgentesCount = citas.filter(c => {
    const alerta = obtenerEstadoTiempoCita(c.fecha_cita, c.hora_cita);
    return alerta.texto.includes('HOY') || alerta.texto.includes('CURSO');
  }).length;

  return (
    <div style={{ backgroundColor: '#07090e', color: '#f1f5f9', minHeight: '100vh', fontFamily: 'Segoe UI, system-ui, sans-serif' }}>
      
      {/* HEADER */}
      <header style={{ backgroundColor: 'rgba(10, 13, 20, 0.95)', backdropFilter: 'blur(12px)', padding: '1.1rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1a2233', position: 'sticky', top: 0, zIndex: 50, flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => { if(!isAdmin) setTab('servicios'); }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'linear-gradient(135deg, #d4af37, #aa7c11)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', color: '#07090e', boxShadow: '0 0 15px rgba(212, 175, 55, 0.3)' }}>⚡</div>
          <div>
            <h1 style={{ color: '#ffffff', fontSize: '1.35rem', margin: 0, fontWeight: 800, letterSpacing: '1px' }}>
              NEXUS <span style={{ color: '#d4af37' }}>DETAIL</span>
            </h1>
            <p style={{ margin: 0, fontSize: '0.68rem', color: '#94a3b8', letterSpacing: '1px' }}>LUXURY AUTOMOTIVE STUDIO</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {!isAdmin && (
            <button
              onClick={() => setShowCarritoModal(true)}
              style={{ backgroundColor: '#12151c', color: '#f8fafc', border: '1px solid #2a3447', padding: '0.6rem 1.1rem', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              🛒 Carrito
              {totalArticulosCarrito > 0 && (
                <span style={{ backgroundColor: '#d4af37', color: '#07090e', borderRadius: '50%', padding: '0.1rem 0.5rem', fontSize: '0.75rem', fontWeight: 900 }}>
                  {totalArticulosCarrito}
                </span>
              )}
            </button>
          )}

          {isAdmin ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)', color: '#d4af37', padding: '0.4rem 0.9rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, border: '1px solid #d4af37' }}>
                👑 Modo Administrador Activo
              </span>
              <button 
                onClick={() => { setIsAdmin(false); setTab('servicios'); }}
                style={{ backgroundColor: '#1a2233', color: '#f8fafc', border: '1px solid #2a3447', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' }}
              >
                Salir Admin
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              style={{ backgroundColor: '#12151c', color: '#d4af37', border: '1px solid #d4af37', padding: '0.6rem 1.2rem', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}
            >
              🔒 Administración
            </button>
          )}

          {!isAdmin && (
            <button
              onClick={() => setTab('citas')}
              style={{ background: 'linear-gradient(135deg, #d4af37, #aa7c11)', color: '#07090e', border: 'none', padding: '0.6rem 1.3rem', borderRadius: '6px', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem' }}
            >
              📅 RESERVAR TURNO
            </button>
          )}
        </div>
      </header>

      {/* MODAL LOGIN */}
      {showLoginModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(7, 9, 14, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#12151c', padding: '2.5rem', borderRadius: '12px', border: '1px solid #d4af37', width: '100%', maxWidth: '400px', boxShadow: '0 15px 35px rgba(0,0,0,0.7)' }}>
            <h3 style={{ color: '#d4af37', marginTop: 0, marginBottom: '0.5rem', fontSize: '1.4rem' }}>Acceso Administrativo</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Ingrese sus credenciales de acceso al sistema.</p>
            
            {loginError && (
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171', padding: '0.8rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem', border: '1px solid #ef4444' }}>
                Usuario o contraseña incorrectos.
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: '#cbd5e1', display: 'block', fontSize: '0.82rem', marginBottom: '0.4rem', fontWeight: 600 }}>Usuario</label>
                <input type="text" value={userAdmin} onChange={(e) => setUserAdmin(e.target.value)} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', backgroundColor: '#07090e', border: '1px solid #1a2233', color: 'white', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ color: '#cbd5e1', display: 'block', fontSize: '0.82rem', marginBottom: '0.4rem', fontWeight: 600 }}>Contraseña</label>
                <input type="password" value={passAdmin} onChange={(e) => setPassAdmin(e.target.value)} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', backgroundColor: '#07090e', border: '1px solid #1a2233', color: 'white', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" style={{ flex: 1, padding: '0.8rem', backgroundColor: '#d4af37', color: '#07090e', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>
                  INGRESAR
                </button>
                <button type="button" onClick={() => setShowLoginModal(false)} style={{ flex: 1, padding: '0.8rem', backgroundColor: '#1a2233', color: '#f8fafc', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                  CANCELAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CARRITO DE COMPRAS */}
      {showCarritoModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(7, 9, 14, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, padding: '1rem' }}>
          <div style={{ backgroundColor: '#12151c', padding: '2rem', borderRadius: '12px', border: '1px solid #d4af37', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 15px 35px rgba(0,0,0,0.8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid #1a2233', paddingBottom: '0.8rem' }}>
              <h3 style={{ color: '#d4af37', margin: 0, fontSize: '1.35rem' }}>🛒 Tu Carrito de Compras</h3>
              <button onClick={() => setShowCarritoModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.3rem', cursor: 'pointer' }}>✖</button>
            </div>

            {carrito.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#94a3b8' }}>
                <p style={{ fontSize: '1rem', marginBottom: '1rem' }}>Aún no has agregado productos a tu carrito.</p>
                <button onClick={() => { setShowCarritoModal(false); setTab('inventario'); }} style={{ backgroundColor: '#d4af37', color: '#07090e', border: 'none', padding: '0.7rem 1.4rem', borderRadius: '6px', fontWeight: 800, cursor: 'pointer' }}>
                  Ir a la Tienda
                </button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
                  {carrito.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#07090e', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #1a2233' }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>{item.nombre_producto}</p>
                        <span style={{ color: '#d4af37', fontSize: '0.82rem', fontWeight: 700 }}>${Number(item.precio_unitario).toLocaleString('es-MX')} c/u</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button onClick={() => cambiarCantidadCarrito(item.id, -1)} style={{ backgroundColor: '#1a2233', color: '#fff', border: 'none', width: '26px', height: '26px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>-</button>
                        <span style={{ color: '#fff', fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>{item.cantidad}</span>
                        <button onClick={() => cambiarCantidadCarrito(item.id, 1)} style={{ backgroundColor: '#1a2233', color: '#fff', border: 'none', width: '26px', height: '26px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                        <button onClick={() => quitarDelCarrito(item.id)} style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: 'none', padding: '0.3rem 0.5rem', borderRadius: '4px', cursor: 'pointer', marginLeft: '4px' }}>🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0a0d14', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #1a2233' }}>
                  <span style={{ color: '#cbd5e1', fontWeight: 700 }}>Total a Pagar:</span>
                  <strong style={{ color: '#d4af37', fontSize: '1.4rem', fontWeight: 900 }}>${totalCarrito.toLocaleString('es-MX')} MXN</strong>
                </div>

                <form onSubmit={confirmarPedidoCarrito}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ color: '#cbd5e1', display: 'block', fontSize: '0.82rem', marginBottom: '0.4rem', fontWeight: 600 }}>Tu Nombre Completo</label>
                    <input type="text" value={compraNombre} onChange={(e) => setCompraNombre(e.target.value)} required placeholder="Escribe tu nombre" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', backgroundColor: '#07090e', border: '1px solid #1a2233', color: 'white', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ color: '#cbd5e1', display: 'block', fontSize: '0.82rem', marginBottom: '0.4rem', fontWeight: 600 }}>Teléfono / Celular</label>
                    <input type="text" value={compraTel} onChange={(e) => setCompraTel(e.target.value)} required placeholder="Escribe tu teléfono" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', backgroundColor: '#07090e', border: '1px solid #1a2233', color: 'white', boxSizing: 'border-box' }} />
                  </div>
                  <button type="submit" style={{ width: '100%', padding: '0.9rem', backgroundColor: '#d4af37', color: '#07090e', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '0.95rem' }}>
                    CONFIRMAR Y ENVIAR PEDIDO
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL EDITAR PRODUCTO (ADMIN) */}
      {productoEditando && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(7, 9, 14, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, padding: '1rem' }}>
          <div style={{ backgroundColor: '#12151c', padding: '2.5rem', borderRadius: '12px', border: '1px solid #d4af37', width: '100%', maxWidth: '450px' }}>
            <h3 style={{ color: '#d4af37', marginTop: 0, marginBottom: '1.2rem', fontSize: '1.35rem' }}>✏️ Editar Producto</h3>
            <form onSubmit={guardarEdicionProducto}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: '#cbd5e1', display: 'block', fontSize: '0.82rem', marginBottom: '0.4rem' }}>Nombre del Producto</label>
                <input type="text" value={productoEditando.nombre_producto} onChange={(e) => setProductoEditando({ ...productoEditando, nombre_producto: e.target.value })} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', backgroundColor: '#07090e', border: '1px solid #1a2233', color: 'white', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: '#cbd5e1', display: 'block', fontSize: '0.82rem', marginBottom: '0.4rem' }}>Categoría</label>
                <select value={productoEditando.categoria_insumo} onChange={(e) => setProductoEditando({ ...productoEditando, categoria_insumo: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', backgroundColor: '#07090e', border: '1px solid #1a2233', color: 'white' }}>
                  <option value="Químicos">Químicos</option>
                  <option value="Accesorios">Accesorios</option>
                  <option value="Herramientas">Herramientas</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#cbd5e1', display: 'block', fontSize: '0.82rem', marginBottom: '0.4rem' }}>Stock</label>
                  <input type="number" value={productoEditando.stock} onChange={(e) => setProductoEditando({ ...productoEditando, stock: e.target.value })} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', backgroundColor: '#07090e', border: '1px solid #1a2233', color: 'white', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#cbd5e1', display: 'block', fontSize: '0.82rem', marginBottom: '0.4rem' }}>Precio ($ MXN)</label>
                  <input type="number" value={productoEditando.precio_unitario} onChange={(e) => setProductoEditando({ ...productoEditando, precio_unitario: e.target.value })} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', backgroundColor: '#07090e', border: '1px solid #1a2233', color: 'white', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ color: '#cbd5e1', display: 'block', fontSize: '0.82rem', marginBottom: '0.4rem' }}>Proveedor</label>
                <input type="text" value={productoEditando.proveedor} onChange={(e) => setProductoEditando({ ...productoEditando, proveedor: e.target.value })} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', backgroundColor: '#07090e', border: '1px solid #1a2233', color: 'white', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" style={{ flex: 1, padding: '0.8rem', backgroundColor: '#d4af37', color: '#07090e', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>
                  GUARDAR CAMBIOS
                </button>
                <button type="button" onClick={() => setProductoEditando(null)} style={{ flex: 1, padding: '0.8rem', backgroundColor: '#1a2233', color: '#f8fafc', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                  CANCELAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HERO BANNER (PÚBLICO) */}
      {!isAdmin && (
        <div style={{
          position: 'relative',
          backgroundImage: 'linear-gradient(to right, rgba(7, 9, 14, 0.97) 40%, rgba(7, 9, 14, 0.6) 100%), url("https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderBottom: '1px solid #1a2233',
          padding: '5rem 2rem'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <span style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)', border: '1px solid rgba(212, 175, 55, 0.4)', color: '#d4af37', padding: '0.35rem 0.9rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              ◆ Alta Exclusividad & Precisión
            </span>
            <h2 style={{ color: '#ffffff', fontSize: '2.8rem', fontWeight: 800, margin: '1rem 0 0.8rem', maxWidth: '650px', lineHeight: '1.15' }}>
              El Arte del Detailing y <span style={{ color: '#d4af37' }}>Protección Suprema</span>
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.02rem', margin: '0 0 1.8rem', maxWidth: '540px', lineHeight: '1.6' }}>
              Tratamientos de alta gama diseñados para preservar, restaurar y realzar la perfección estética de su vehículo.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={() => setTab('servicios')} style={{ backgroundColor: '#d4af37', color: '#07090e', border: 'none', padding: '0.85rem 1.6rem', borderRadius: '6px', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem' }}>
                Ver Servicios Exclusivos
              </button>
              <button onClick={() => setTab('inventario')} style={{ backgroundColor: 'rgba(18, 21, 28, 0.9)', color: '#f8fafc', border: '1px solid #2a3447', padding: '0.85rem 1.6rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
                Explorar Tienda
              </button>
            </div>
          </div>
        </div>
      )}

      <main style={{ maxWidth: '1200px', margin: '2.5rem auto', padding: '0 1.5rem' }}>

        {/* NAVEGACIÓN PÚBLICA */}
        {!isAdmin && (
          <nav style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem', borderBottom: '1px solid #1a2233', paddingBottom: '1.2rem', flexWrap: 'wrap' }}>
            {[
              { id: 'servicios', label: '🚗 Servicios & Tratamientos' },
              { id: 'citas', label: '📅 Reservación en Línea' },
              { id: 'inventario', label: '🧴 Tienda & Insumos' },
              { id: 'empleados', label: '👨‍🔧 Maestros Detalers' },
              { id: 'promociones', label: '✨ Promociones y Paquetes' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  padding: '0.8rem 1.4rem',
                  backgroundColor: tab === t.id ? '#12151c' : '#0a0d14',
                  color: tab === t.id ? '#d4af37' : '#94a3b8',
                  border: tab === t.id ? '1px solid #d4af37' : '1px solid #1a2233',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  boxShadow: tab === t.id ? '0 4px 15px rgba(212, 175, 55, 0.15)' : 'none',
                  transition: '0.2s'
                }}
              >
                {t.label}
              </button>
            ))}
          </nav>
        )}

        {/* ================= VISTA USUARIO: SERVICIOS ================= */}
        {!isAdmin && tab === 'servicios' && (
          <div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Buscar servicio..."
                value={busquedaServicio}
                onChange={(e) => setBusquedaServicio(e.target.value)}
                style={{ flex: 1, minWidth: '260px', padding: '0.85rem 1.2rem', borderRadius: '8px', border: '1px solid #1a2233', backgroundColor: '#12151c', color: 'white', fontSize: '0.95rem' }}
              />
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                style={{ padding: '0.85rem 1.2rem', borderRadius: '8px', border: '1px solid #1a2233', backgroundColor: '#12151c', color: 'white', cursor: 'pointer', fontSize: '0.95rem' }}
              >
                <option value="Todas">Todas las categorías</option>
                {categorias.map(c => (
                  <option key={c.id} value={c.nombre_categoria}>{c.nombre_categoria}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.8rem' }}>
              {serviciosFiltrados.map((s) => (
                <div key={s.id} style={{ backgroundColor: '#12151c', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1a2233', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                  <div style={{ position: 'relative', height: '190px', backgroundColor: '#07090e' }}>
                    <img src={s.imagen_url || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80'} alt={s.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', top: '12px', left: '12px', fontSize: '0.68rem', color: '#07090e', textTransform: 'uppercase', fontWeight: 800, backgroundColor: '#d4af37', padding: '0.3rem 0.7rem', borderRadius: '4px' }}>
                      {s.nombre_categoria || 'Exclusivo'}
                    </span>
                  </div>
                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ margin: '0 0 0.5rem', color: '#ffffff', fontSize: '1.15rem', fontWeight: 700 }}>{s.nombre}</h3>
                      <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 1.4rem', lineHeight: '1.5' }}>{s.descripcion}</p>
                    </div>
                    <div>
                      <div style={{ borderTop: '1px solid #1a2233', paddingTop: '0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Inversión</span>
                        <strong style={{ color: '#d4af37', fontSize: '1.3rem', fontWeight: 800 }}>${Number(s.precio).toLocaleString('es-MX')}</strong>
                      </div>
                      <button onClick={() => seleccionarServicioParaCita(s.nombre)} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1a2233', color: '#ffffff', border: '1px solid #2a3447', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}>
                        Seleccionar Tratamiento →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= VISTA USUARIO: CITAS ================= */}
        {!isAdmin && tab === 'citas' && (
          <div style={{ maxWidth: '650px', margin: '0 auto' }}>
            <div style={{ backgroundColor: '#12151c', padding: '2.5rem', borderRadius: '12px', border: '1px solid #1a2233' }}>
              <h3 style={{ color: '#d4af37', marginTop: 0, marginBottom: '0.4rem', fontSize: '1.4rem' }}>📅 Agendar Cita en el Estudio</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: 0, marginBottom: '1.8rem' }}>Seleccione su servicio preferido y reserve su espacio de alta gama.</p>
              
              {citaExito && (
                <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)', color: '#d4af37', padding: '1.1rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center', fontWeight: 700, border: '1px solid #d4af37' }}>
                  ✦ ¡Cita agendada con éxito! Le esperamos en el estudio.
                </div>
              )}

              <form onSubmit={guardarCita}>
                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={{ color: '#cbd5e1', display: 'block', fontSize: '0.82rem', marginBottom: '0.4rem', fontWeight: 600 }}>Nombre del Cliente</label>
                  <input type="text" value={cCliente} onChange={(e) => setCCliente(e.target.value)} required placeholder="Escriba su nombre" style={{ width: '100%', padding: '0.85rem', borderRadius: '8px', backgroundColor: '#07090e', border: '1px solid #1a2233', color: 'white', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={{ color: '#cbd5e1', display: 'block', fontSize: '0.82rem', marginBottom: '0.4rem', fontWeight: 600 }}>Teléfono / Celular</label>
                  <input type="text" value={cTel} onChange={(e) => setCTel(e.target.value)} required placeholder="Escriba su número" style={{ width: '100%', padding: '0.85rem', borderRadius: '8px', backgroundColor: '#07090e', border: '1px solid #1a2233', color: 'white', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={{ color: '#cbd5e1', display: 'block', fontSize: '0.82rem', marginBottom: '0.4rem', fontWeight: 600 }}>Tratamiento Requerido</label>
                  <select value={cServ} onChange={(e) => setCServ(e.target.value)} required style={{ width: '100%', padding: '0.85rem', borderRadius: '8px', backgroundColor: '#07090e', border: '1px solid #1a2233', color: 'white' }}>
                    <option value="">-- Seleccionar tratamiento --</option>
                    {servicios.map((s, idx) => (
                      <option key={s.id || idx} value={s.nombre}>{s.nombre} — ${Number(s.precio).toLocaleString('es-MX')}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.8rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ color: '#cbd5e1', display: 'block', fontSize: '0.82rem', marginBottom: '0.4rem', fontWeight: 600 }}>Fecha</label>
                    <input type="date" value={cFecha} onChange={(e) => setCFecha(e.target.value)} required style={{ width: '100%', padding: '0.85rem', borderRadius: '8px', backgroundColor: '#07090e', border: '1px solid #1a2233', color: 'white', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ color: '#cbd5e1', display: 'block', fontSize: '0.82rem', marginBottom: '0.4rem', fontWeight: 600 }}>Hora</label>
                    <input type="time" value={cHora} onChange={(e) => setCHora(e.target.value)} required style={{ width: '100%', padding: '0.85rem', borderRadius: '8px', backgroundColor: '#07090e', border: '1px solid #1a2233', color: 'white', boxSizing: 'border-box' }} />
                  </div>
                </div>
                <button type="submit" style={{ width: '100%', padding: '0.95rem', backgroundColor: '#d4af37', color: '#07090e', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>
                  CONFIRMAR RESERVACIÓN
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ================= VISTA USUARIO: TIENDA CON CARRITO ================= */}
        {!isAdmin && tab === 'inventario' && (
          <div>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <input type="text" placeholder="Buscar producto en tienda..." value={busquedaProducto} onChange={(e) => setBusquedaProducto(e.target.value)} style={{ width: '100%', maxWidth: '420px', padding: '0.85rem 1.2rem', borderRadius: '8px', border: '1px solid #1a2233', backgroundColor: '#12151c', color: 'white' }} />
              
              {totalArticulosCarrito > 0 && (
                <button onClick={() => setShowCarritoModal(true)} style={{ backgroundColor: '#d4af37', color: '#07090e', border: 'none', padding: '0.8rem 1.4rem', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem' }}>
                  🛒 Ver Carrito ({totalArticulosCarrito}) — ${totalCarrito.toLocaleString('es-MX')}
                </button>
              )}
            </div>

            {mensajeCompra && (
              <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)', color: '#d4af37', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', textAlign: 'center', fontWeight: 700, border: '1px solid #d4af37' }}>
                {mensajeCompra}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.8rem' }}>
              {productosFiltrados.map((i) => {
                const enCarrito = carrito.find((c) => c.id === i.id);
                return (
                  <div key={i.id} style={{ backgroundColor: '#12151c', borderRadius: '12px', border: '1px solid #1a2233', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 8px 20px rgba(0,0,0,0.4)' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                        <span style={{ fontSize: '0.72rem', color: '#d4af37', backgroundColor: 'rgba(212, 175, 55, 0.15)', padding: '0.25rem 0.6rem', borderRadius: '4px', fontWeight: 700, textTransform: 'uppercase' }}>
                          {i.categoria_insumo}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: i.stock > 0 ? '#34d399' : '#f87171', fontWeight: 700 }}>
                          ● {i.stock} disponibles
                        </span>
                      </div>
                      <h3 style={{ color: '#ffffff', fontSize: '1.1rem', margin: '0 0 0.4rem', fontWeight: 700 }}>🧴 {i.nombre_producto}</h3>
                      <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 1.2rem' }}>Proveedor: <strong style={{ color: '#cbd5e1' }}>{i.proveedor}</strong></p>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1a2233', paddingTop: '1rem', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Precio</span>
                        <strong style={{ color: '#d4af37', fontSize: '1.25rem', fontWeight: 800 }}>${Number(i.precio_unitario).toLocaleString('es-MX')}</strong>
                      </div>
                      <button onClick={() => agregarAlCarrito(i)} style={{ width: '100%', padding: '0.75rem', backgroundColor: enCarrito ? '#10b981' : '#d4af37', color: '#07090e', border: 'none', borderRadius: '6px', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem' }}>
                        {enCarrito ? `✓ En Carrito (${enCarrito.cantidad}) + Agregar otro` : '🛒 Agregar al Carrito'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= VISTA USUARIO: EMPLEADOS ================= */}
        {!isAdmin && tab === 'empleados' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.8rem' }}>
            {empleados.map((em) => (
              <div key={em.id} style={{ backgroundColor: '#12151c', borderRadius: '12px', border: '1px solid #1a2233', padding: '1.8rem', boxShadow: '0 8px 20px rgba(0,0,0,0.4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(212, 175, 55, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>👨‍🔧</div>
                  <div>
                    <h3 style={{ color: '#fff', fontSize: '1.1rem', margin: 0, fontWeight: 700 }}>{em.nombre_empleado}</h3>
                    <span style={{ color: '#34d399', fontSize: '0.78rem', fontWeight: 700 }}>● {em.estado}</span>
                  </div>
                </div>
                <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: '0 0 1rem' }}><strong style={{ color: '#d4af37' }}>Especialidad:</strong> {em.especialidad}</p>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>📞 Teléfono: {em.telefono}</p>
              </div>
            ))}
          </div>
        )}

        {/* ================= VISTA USUARIO: PROMOCIONES ================= */}
        {!isAdmin && tab === 'promociones' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.8rem' }}>
            {promociones.map((p) => (
              <div key={p.id} style={{ background: 'linear-gradient(135deg, #12151c, #1a2233)', borderRadius: '12px', border: '1px solid #d4af37', padding: '2rem', boxShadow: '0 10px 25px rgba(212,175,55,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: 0, fontWeight: 800 }}>✨ {p.titulo_promo}</h3>
                  <span style={{ backgroundColor: '#d4af37', color: '#07090e', padding: '0.3rem 0.8rem', borderRadius: '20px', fontWeight: 900, fontSize: '0.85rem' }}>{p.descuento_porcentaje}% OFF</span>
                </div>
                <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: '0 0 1.5rem', lineHeight: '1.5' }}>{p.descripcion_promo}</p>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.9rem', fontSize: '0.82rem', color: '#94a3b8' }}>
                  📅 Vigencia válida hasta el: <strong style={{ color: '#fff' }}>{String(p.vigencia).split('T')[0]}</strong>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= PANEL DE ADMINISTRACIÓN EXCLUSIVO ================= */}
        {isAdmin && (
          <div>
            <div style={{ marginBottom: '2rem', borderBottom: '1px solid #1a2233', paddingBottom: '1rem' }}>
              <h2 style={{ color: '#d4af37', fontSize: '2rem', fontWeight: 800, margin: 0 }}>⚙️ Panel de Control y Gestión del Estudio</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: '0.4rem 0 0' }}>Supervise citas de clientes, alertas de tiempo, pedidos y gestione catálogos.</p>
            </div>

            {/* Banner de Aviso de Citas Próximas */}
            {citasUrgentesCount > 0 && (
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', padding: '1rem 1.5rem', borderRadius: '10px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.5rem' }}>🔔</span>
                <div>
                  <strong style={{ color: '#fca5a5', display: 'block', fontSize: '0.95rem' }}>¡Atención! Tienes {citasUrgentesCount} {citasUrgentesCount === 1 ? 'cita programada' : 'citas programadas'} para hoy o en menos de 24 horas.</strong>
                  <span style={{ color: '#cbd5e1', fontSize: '0.82rem' }}>Revisa los indicadores de estado en la tabla inferior para preparar el espacio.</span>
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '2rem' }}>
              
              {/* 1. Citas Solicitadas con Alerta de Tiempo y Botón de Atendida/Eliminar */}
              <div style={{ backgroundColor: '#12151c', padding: '2rem', borderRadius: '12px', border: '1px solid #1a2233', overflowX: 'auto', height: 'fit-content' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div>
                    <h3 style={{ color: '#d4af37', marginTop: 0, marginBottom: '0.3rem', fontSize: '1.35rem' }}>🕒 Citas Solicitadas</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>Control de agenda y alertas de proximidad.</p>
                  </div>
                  <span style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)', color: '#d4af37', padding: '0.3rem 0.8rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
                    {citas.length} Pendientes
                  </span>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #1a2233', color: '#d4af37' }}>
                      <th style={{ padding: '0.8rem' }}>CLIENTE / TEL</th>
                      <th style={{ padding: '0.8rem' }}>TRATAMIENTO</th>
                      <th style={{ padding: '0.8rem' }}>FECHA Y HORA</th>
                      <th style={{ padding: '0.8rem' }}>PROXIMIDAD</th>
                      <th style={{ padding: '0.8rem', textAlign: 'right' }}>ACCIÓN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {citas.map((c) => {
                      const alerta = obtenerEstadoTiempoCita(c.fecha_cita, c.hora_cita);
                      return (
                        <tr key={c.id || Math.random()} style={{ borderBottom: '1px solid #1a2233' }}>
                          <td style={{ padding: '0.85rem' }}>
                            <strong style={{ color: '#ffffff', display: 'block' }}>{c.nombre_cliente}</strong>
                            <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>📞 {c.telefono}</span>
                          </td>
                          <td style={{ padding: '0.85rem', color: '#cbd5e1' }}>{c.servicio_solicitado}</td>
                          <td style={{ padding: '0.85rem', color: '#94a3b8' }}>
                            📅 {String(c.fecha_cita).split('T')[0]} <br />
                            ⏰ {c.hora_cita}
                          </td>
                          <td style={{ padding: '0.85rem' }}>
                            <span style={{ backgroundColor: alerta.bg, color: alerta.color, padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800, whiteSpace: 'nowrap' }}>
                              {alerta.texto}
                            </span>
                          </td>
                          <td style={{ padding: '0.85rem', textAlign: 'right' }}>
                            <button
                              onClick={() => eliminarCitaAtendida(c.id)}
                              title="Marcar cita como atendida y eliminar"
                              style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid #10b981', padding: '0.4rem 0.7rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap' }}
                            >
                              ✓ Atendida
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {citas.length === 0 && (
                      <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No hay citas pendientes por atender.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* 2. Pedidos de Carrito Solicitados con Botón de Entregado/Eliminar */}
              <div style={{ backgroundColor: '#12151c', padding: '2rem', borderRadius: '12px', border: '1px solid #d4af37', overflowX: 'auto', height: 'fit-content' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div>
                    <h3 style={{ color: '#d4af37', marginTop: 0, marginBottom: '0.3rem', fontSize: '1.35rem' }}>🛒 Pedidos de Tienda</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>Compras solicitadas por clientes.</p>
                  </div>
                  <span style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)', color: '#d4af37', padding: '0.3rem 0.8rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
                    {pedidosClientes.length} Pedidos
                  </span>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #1a2233', color: '#d4af37' }}>
                      <th style={{ padding: '0.8rem' }}>CLIENTE / TEL</th>
                      <th style={{ padding: '0.8rem' }}>PRODUCTOS</th>
                      <th style={{ padding: '0.8rem' }}>TOTAL</th>
                      <th style={{ padding: '0.8rem', textAlign: 'right' }}>ACCIÓN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidosClientes.map((pc) => (
                      <tr key={pc.id || Math.random()} style={{ borderBottom: '1px solid #1a2233' }}>
                        <td style={{ padding: '0.85rem' }}>
                          <strong style={{ color: '#ffffff', display: 'block' }}>{pc.nombre_cliente}</strong>
                          <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>📞 {pc.telefono}</span>
                        </td>
                        <td style={{ padding: '0.85rem', color: '#cbd5e1' }}>{pc.nombre_producto}</td>
                        <td style={{ padding: '0.85rem', fontWeight: 800, color: '#d4af37' }}>${Number(pc.precio).toLocaleString('es-MX')}</td>
                        <td style={{ padding: '0.85rem', textAlign: 'right' }}>
                          <button
                            onClick={() => eliminarPedidoEntregado(pc.id)}
                            title="Marcar pedido como entregado y eliminar"
                            style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid #10b981', padding: '0.4rem 0.7rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap' }}
                          >
                            ✓ Entregado
                          </button>
                        </td>
                      </tr>
                    ))}
                    {pedidosClientes.length === 0 && (
                      <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No hay pedidos pendientes.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>

            {/* Formularios de Registro en Admin */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
              
              {/* Agregar Servicio */}
              <div style={{ backgroundColor: '#12151c', padding: '2.5rem', borderRadius: '12px', border: '1px solid #1a2233' }}>
                <h3 style={{ color: '#d4af37', marginTop: 0, marginBottom: '0.4rem', fontSize: '1.4rem' }}>📸 Agregar Nuevo Servicio</h3>
                {servicioExito && <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)', color: '#d4af37', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center', fontWeight: 700 }}>✦ ¡Servicio agregado!</div>}
                
                <form onSubmit={agregarServicioAdmin}>
                  <div style={{ marginBottom: '1.1rem' }}>
                    <label style={{ color: '#cbd5e1', display: 'block', fontSize: '0.82rem', marginBottom: '0.4rem', fontWeight: 600 }}>Nombre</label>
                    <input type="text" value={nuevoServNombre} onChange={(e) => setNuevoServNombre(e.target.value)} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', backgroundColor: '#07090e', border: '1px solid #1a2233', color: 'white', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ marginBottom: '1.1rem' }}>
                    <label style={{ color: '#cbd5e1', display: 'block', fontSize: '0.82rem', marginBottom: '0.4rem', fontWeight: 600 }}>Descripción</label>
                    <input type="text" value={nuevoServDesc} onChange={(e) => setNuevoServDesc(e.target.value)} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', backgroundColor: '#07090e', border: '1px solid #1a2233', color: 'white', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ marginBottom: '1.1rem' }}>
                    <label style={{ color: '#cbd5e1', display: 'block', fontSize: '0.82rem', marginBottom: '0.4rem', fontWeight: 600 }}>URL de Imagen</label>
                    <input type="text" value={nuevoServImg} onChange={(e) => setNuevoServImg(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', backgroundColor: '#07090e', border: '1px solid #1a2233', color: 'white', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ marginBottom: '1.1rem' }}>
                    <label style={{ color: '#cbd5e1', display: 'block', fontSize: '0.82rem', marginBottom: '0.4rem', fontWeight: 600 }}>Precio ($ MXN)</label>
                    <input type="number" value={nuevoServPrecio} onChange={(e) => setNuevoServPrecio(e.target.value)} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', backgroundColor: '#07090e', border: '1px solid #1a2233', color: 'white', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ color: '#cbd5e1', display: 'block', fontSize: '0.82rem', marginBottom: '0.4rem', fontWeight: 600 }}>Categoría</label>
                    <select value={nuevoServCat} onChange={(e) => setNuevoServCat(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', backgroundColor: '#07090e', border: '1px solid #1a2233', color: 'white' }}>
                      {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre_categoria}</option>)}
                    </select>
                  </div>
                  <button type="submit" style={{ width: '100%', padding: '0.9rem', backgroundColor: '#d4af37', color: '#07090e', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>REGISTRAR SERVICIO</button>
                </form>
              </div>
              {/* Sección de Gestión de Servicios en Admin */}
<div style={{ marginTop: '2.5rem', background: '#12151c', padding: '2.5rem', borderRadius: '11px', border: '1px solid #1a2233' }}>
  <h3 style={{ color: '#d4af37', fontSize: '1.4rem', marginBottom: '1.5rem' }}>🛠️ Gestión y Edición de Servicios Activos</h3>
  
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    {servicios.map((servicio) => (
      <div key={servicio.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1a2233', padding: '1rem', borderRadius: '8px', border: '1px solid #2a3447' }}>
        <div>
          <h4 style={{ color: '#fff', margin: '0 0 0.3rem 0', fontSize: '1.1rem' }}>{servicio.nombre}</h4>
          <span style={{ color: '#d4af37', fontSize: '0.9rem' }}>Precio: ${servicio.precio}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button 
            onClick={() => prepararEdicionServicio(servicio)} 
            style={{ padding: '0.5rem 1rem', background: '#d4af37', color: '#12151c', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}
          >
            Editar
          </button>
          <button 
            onClick={() => eliminarServicio(servicio.id)} 
            style={{ padding: '0.5rem 1rem', background: '#8b0000', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}
          >
            Eliminar
          </button>
        </div>
      </div>
    ))}
  </div>
</div>

              {/* Agregar Producto */}
              <div style={{ backgroundColor: '#12151c', padding: '2.5rem', borderRadius: '12px', border: '1px solid #1a2233' }}>
                <h3 style={{ color: '#d4af37', marginTop: 0, marginBottom: '0.4rem', fontSize: '1.4rem' }}>🧴 Agregar Producto a Tienda</h3>
                {productoExito && <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)', color: '#d4af37', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center', fontWeight: 700 }}>✦ ¡Producto agregado!</div>}
                
                <form onSubmit={agregarProductoAdmin}>
                  <div style={{ marginBottom: '1.1rem' }}>
                    <label style={{ color: '#cbd5e1', display: 'block', fontSize: '0.82rem', marginBottom: '0.4rem', fontWeight: 600 }}>Nombre del Producto</label>
                    <input type="text" value={nuevoProdNombre} onChange={(e) => setNuevoProdNombre(e.target.value)} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', backgroundColor: '#07090e', border: '1px solid #1a2233', color: 'white', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ marginBottom: '1.1rem' }}>
                    <label style={{ color: '#cbd5e1', display: 'block', fontSize: '0.82rem', marginBottom: '0.4rem', fontWeight: 600 }}>Categoría de Insumo</label>
                    <select value={nuevoProdCat} onChange={(e) => setNuevoProdCat(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', backgroundColor: '#07090e', border: '1px solid #1a2233', color: 'white' }}>
                      <option value="Químicos">Químicos</option>
                      <option value="Accesorios">Accesorios</option>
                      <option value="Herramientas">Herramientas</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: '1.1rem' }}>
                    <label style={{ color: '#cbd5e1', display: 'block', fontSize: '0.82rem', marginBottom: '0.4rem', fontWeight: 600 }}>Stock</label>
                    <input type="number" value={nuevoProdStock} onChange={(e) => setNuevoProdStock(e.target.value)} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', backgroundColor: '#07090e', border: '1px solid #1a2233', color: 'white', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ marginBottom: '1.1rem' }}>
                    <label style={{ color: '#cbd5e1', display: 'block', fontSize: '0.82rem', marginBottom: '0.4rem', fontWeight: 600 }}>Precio Unitario ($ MXN)</label>
                    <input type="number" value={nuevoProdPrecio} onChange={(e) => setNuevoProdPrecio(e.target.value)} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', backgroundColor: '#07090e', border: '1px solid #1a2233', color: 'white', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ color: '#cbd5e1', display: 'block', fontSize: '0.82rem', marginBottom: '0.4rem', fontWeight: 600 }}>Proveedor</label>
                    <input type="text" value={nuevoProdProv} onChange={(e) => setNuevoProdProv(e.target.value)} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', backgroundColor: '#07090e', border: '1px solid #1a2233', color: 'white', boxSizing: 'border-box' }} />
                  </div>
                  <button type="submit" style={{ width: '100%', padding: '0.9rem', backgroundColor: '#d4af37', color: '#07090e', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>REGISTRAR PRODUCTO</button>
                </form>
              </div>

            </div>

            {/* Gestión / Edición / Eliminación de Catálogos */}
            <div style={{ backgroundColor: '#12151c', padding: '2.5rem', borderRadius: '12px', border: '1px solid #1a2233', marginTop: '2rem' }}>
              <h3 style={{ color: '#d4af37', marginTop: 0, marginBottom: '0.4rem', fontSize: '1.4rem' }}>🛠️ Gestión, Edición y Eliminación</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginTop: '1.5rem' }}>
                <div>
                  <h4 style={{ color: '#fff', borderBottom: '1px solid #1a2233', paddingBottom: '0.5rem' }}>Servicios Activos</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '220px', overflowY: 'auto', marginTop: '0.8rem' }}>
                    {servicios.map(s => (
                      <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#07090e', padding: '0.6rem 0.9rem', borderRadius: '6px', border: '1px solid #1a2233' }}>
                        <span style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>{s.nombre}</span>
                        <button onClick={() => eliminarServicioAdmin(s.id)} style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid #ef4444', padding: '0.25rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>Eliminar</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 style={{ color: '#fff', borderBottom: '1px solid #1a2233', paddingBottom: '0.5rem' }}>Productos en Tienda</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '220px', overflowY: 'auto', marginTop: '0.8rem' }}>
                    {inventario.map(i => (
                      <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#07090e', padding: '0.6rem 0.9rem', borderRadius: '6px', border: '1px solid #1a2233', gap: '8px' }}>
                        <div style={{ flex: 1 }}>
                          <span style={{ color: '#cbd5e1', fontSize: '0.85rem', display: 'block', fontWeight: 600 }}>{i.nombre_producto}</span>
                          <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Stock: {i.stock} | ${Number(i.precio_unitario).toLocaleString('es-MX')}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => setProductoEditando(i)} style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)', color: '#d4af37', border: '1px solid #d4af37', padding: '0.25rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>
                            Editar
                          </button>
                          <button onClick={() => eliminarProductoAdmin(i.id)} style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid #ef4444', padding: '0.25rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#07090e', borderTop: '1px solid #1a2233', padding: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem', marginTop: '4rem' }}>
        <p style={{ margin: '0 0 0.3rem', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.5px' }}>NEXUS DETAIL — Luxury Automotive Studio</p>
        <p style={{ margin: 0 }}>Desarrollado por Anker Emiliano Ledesma Miranda (N° 23) | CECyTEM Jilotepec</p>
      </footer>
    </div>
  );
}

export default App;
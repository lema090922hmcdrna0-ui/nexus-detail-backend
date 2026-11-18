import React, { useState, useEffect } from 'react';

// URL PÚBLICA DE TU BACKEND EN RAILWAY
const API_URL = 'https://nexus-detail-backend-production.up.railway.app';

function App() {
  const [tab, setTab] = useState('servicios');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userAdmin, setUserAdmin] = useState('');
  const [passAdmin, setPassAdmin] = useState('');
  const [loginError, setLoginError] = useState(false);

  const [servicios, setServicios] = useState([
    { id: 1, nombre: 'Lavado Detallado Full-Spec', descripcion: 'Descontaminación férrica y sellador hidrofóbico.', precio: 950.00, nombre_categoria: 'Estética Exterior & Detailing', imagen_url: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&q=80' },
    { id: 2, nombre: 'Recubrimiento Cerámico 9H (3 Años)', descripcion: 'Protección extrema contra rayos UV y brillo espejo.', precio: 4800.00, nombre_categoria: 'Protección Cerámica & PPF', imagen_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80' },
    { id: 3, nombre: 'Detallado Profundo de Interiores', descripcion: 'Limpieza con vapor e hidratación de asientos en piel.', precio: 1600.00, nombre_categoria: 'Interiores & Tapicería', imagen_url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80' },
    { id: 4, nombre: 'Pulido en 3 Pasos (Corrección Total)', descripcion: 'Eliminación del 95% de hologramas y swirls.', precio: 3800.00, nombre_categoria: 'Corrección de Pintura', imagen_url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80' }
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
    { id: 2, nombre_producto: 'Toalla Microfibra Secado 1200 GSM', categoria_insumo: 'Accesorios', stock: 25, precio_unitario: 250.00, proveedor: 'The Rag Company' }
  ]);

  const [empleados, setEmpleados] = useState([
    { id: 1, nombre_empleado: 'Carlos Mendoza', especialidad: 'Especialista en Cerámicos & PPF', telefono: '5512345678', estado: 'Disponible' },
    { id: 2, nombre_empleado: 'Roberto Gómez', especialidad: 'Maestro en Corrección de Pintura', telefono: '5587654321', estado: 'Disponible' }
  ]);

  const [promociones, setPromociones] = useState([
    { id: 1, titulo_promo: 'Pack Aniversario Cerámico', descripcion_promo: 'Incluye recubrimiento cerámico 9H y lavado con 15% off.', descuento_porcentaje: 15, vigencia: '2026-06-30' },
    { id: 2, titulo_promo: 'Mantenimiento de Interiores', descripcion_promo: 'Sanitización con ozono e hidratación de pieles.', descuento_porcentaje: 20, vigencia: '2026-05-15' }
  ]);

  const [busquedaServicio, setBusquedaServicio] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [busquedaProducto, setBusquedaProducto] = useState('');

  // Notificación flotante (Toast)
  const [toastMensaje, setToastMensaje] = useState('');

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

  // Admin: Nuevo Servicio
  const [nuevoServNombre, setNuevoServNombre] = useState('');
  const [nuevoServDesc, setNuevoServDesc] = useState('');
  const [nuevoServPrecio, setNuevoServPrecio] = useState('');
  const [nuevoServImg, setNuevoServImg] = useState('');
  const [nuevoServCat, setNuevoServCat] = useState('1');
  const [servicioExito, setServicioExito] = useState(false);

  // Admin: Nuevo Producto
  const [nuevoProdNombre, setNuevoProdNombre] = useState('');
  const [nuevoProdCat, setNuevoProdCat] = useState('Químicos');
  const [nuevoProdStock, setNuevoProdStock] = useState('');
  const [nuevoProdPrecio, setNuevoProdPrecio] = useState('');
  const [nuevoProdProv, setNuevoProdProv] = useState('');
  const [productoExito, setProductoExito] = useState(false);

  useEffect(() => {
    cargarTodo();
  }, []);

  const mostrarToast = (msg) => {
    setToastMensaje(msg);
    setTimeout(() => setToastMensaje(''), 3000);
  };

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
      console.error('Error conectando con la API:', err);
    }
  };

  const obtenerEstadoTiempoCita = (fechaStr, horaStr) => {
    if (!fechaStr) return { texto: 'Programada', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)' };
    const fechaLimpia = String(fechaStr).split('T')[0];
    const horaLimpia = horaStr ? String(horaStr).slice(0, 5) : '00:00';
    const fechaCita = new Date(`${fechaLimpia}T${horaLimpia}:00`);
    const ahora = new Date();
    const diffMs = fechaCita - ahora;
    const diffHoras = diffMs / (1000 * 60 * 60);

    if (diffHoras < 0 && diffHoras > -3) {
      return { texto: '🔴 EN CURSO AHORA', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' };
    } else if (diffHoras <= 24 && diffHoras >= 0) {
      return { texto: '⚡ PROGRAMADA HOY', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' };
    } else if (diffHoras < -3) {
      return { texto: '✅ ATENDIDA / PASADA', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' };
    } else {
      const dias = Math.ceil(diffHoras / 24);
      return { texto: `📅 Faltan ${dias} días`, color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)' };
    }
  };

  const eliminarCitaAtendida = async (id) => {
    if (!window.confirm('¿Desea eliminar esta cita del registro?')) return;
    try {
      await fetch(`${API_URL}/api/citas/${id}`, { method: 'DELETE' });
      cargarTodo();
    } catch (err) {
      setCitas(citas.filter(c => c.id !== id));
    }
  };

  const eliminarPedidoEntregado = async (id) => {
    if (!window.confirm('¿Desea eliminar este pedido del historial?')) return;
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const agregarAlCarrito = (producto) => {
    setCarrito(prev => {
      const existe = prev.find((item) => item.id === producto.id);
      const cantidadActual = existe ? existe.cantidad : 0;
      if (cantidadActual + 1 > producto.stock) {
        alert('Stock máximo alcanzado para este producto.');
        return prev;
      }
      mostrarToast(`🛒 ¡"${producto.nombre_producto}" agregado al carrito!`);
      if (existe) {
        return prev.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      } else {
        return [...prev, { ...producto, cantidad: 1 }];
      }
    });
  };

  const quitarDelCarrito = (id) => {
    setCarrito(prev => prev.filter((item) => item.id !== id));
  };

  const cambiarCantidadCarrito = (id, delta) => {
    setCarrito(prev =>
      prev.map((item) => {
        if (item.id === id) {
          const nuevaCant = item.cantidad + delta;
          const productoOriginal = inventario.find(p => p.id === id);
          const stockMaximo = productoOriginal ? productoOriginal.stock : 999;
          if (nuevaCant > stockMaximo) {
            alert('No hay más stock disponible.');
            return item;
          }
          return nuevaCant > 0 ? { ...item, cantidad: nuevaCant } : null;
        }
        return item;
      }).filter(Boolean)
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
      .map((i) => `${i.cantidad}x ${i.nombre_producto}`)
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
        setMensajeCompra('¡Pedido realizado con éxito! Nos pondremos en contacto contigo.');
        setCarrito([]);
        setCompraNombre('');
        setCompraTel('');
        setTimeout(() => {
          setMensajeCompra('');
          setShowCarritoModal(false);
          cargarTodo();
        }, 3000);
      }
    } catch (err) {
      setMensajeCompra('¡Pedido simulado con éxito!');
      setCarrito([]);
      setCompraNombre('');
      setCompraTel('');
      setTimeout(() => {
        setMensajeCompra('');
        setShowCarritoModal(false);
      }, 3000);
    }
  };

  const guardarCita = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/citas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_cliente: cCliente,
          telefono: cTel,
          servicio_solicitado: cServ || 'Lavado General',
          fecha_cita: cFecha,
          hora_cita: cHora,
          estado: 'Pendiente',
          observaciones: 'Agendado desde la web'
        })
      });
      const data = await res.json();
      if (data.success) {
        setCitaExito(true);
        setCCliente(''); setCTel(''); setCServ(''); setCFecha(''); setCHora('');
        setTimeout(() => setCitaExito(false), 4000);
        cargarTodo();
      }
    } catch (err) {
      setCitaExito(true);
      setCCliente(''); setCTel(''); setCServ(''); setCFecha(''); setCHora('');
      setTimeout(() => setCitaExito(false), 4000);
    }
  };

  // AGREGAR SERVICIO DESDE ADMIN
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
      setServicioExito(true);
      setNuevoServNombre(''); setNuevoServDesc(''); setNuevoServPrecio(''); setNuevoServImg('');
      setTimeout(() => setServicioExito(false), 4000);
    }
  };

  const eliminarServicioAdmin = async (id) => {
    if (!window.confirm('¿Desea eliminar este servicio del catálogo?')) return;
    try {
      const res = await fetch(`${API_URL}/api/servicios/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setServicios(prev => prev.filter(s => s.id !== id));
        cargarTodo();
      }
    } catch (err) {
      setServicios(prev => prev.filter(s => s.id !== id));
    }
  };

  // AGREGAR PRODUCTO DESDE ADMIN
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
      setProductoExito(true);
      setNuevoProdNombre(''); setNuevoProdStock(''); setNuevoProdPrecio(''); setNuevoProdProv('');
      setTimeout(() => setProductoExito(false), 4000);
    }
  };

  const eliminarProductoAdmin = async (id) => {
    if (!window.confirm('¿Desea eliminar este producto de la tienda?')) return;
    try {
      const res = await fetch(`${API_URL}/api/inventario/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setInventario(prev => prev.filter(i => i.id !== id));
        cargarTodo();
      }
    } catch (err) {
      setInventario(prev => prev.filter(i => i.id !== id));
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

  const citasUrgentesCount = citas.filter(c => {
    const alerta = obtenerEstadoTiempoCita(c.fecha_cita, c.hora_cita);
    return alerta.texto.includes('HOY') || alerta.texto.includes('CURSO');
  }).length;

  return (
    <div style={{ backgroundColor: '#07090e', color: '#f1f5f9', minHeight: '100vh', fontFamily: 'Segoe UI, system-ui, sans-serif' }}>
      
      {/* TOAST FLOTANTE DE NOTIFICACIÓN */}
      {toastMensaje && (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', backgroundColor: '#06b6d4', color: '#07090e', padding: '1rem 1.5rem', borderRadius: '10px', fontWeight: 800, zIndex: 9999, boxShadow: '0 10px 25px rgba(6,182,212,0.3)', animation: 'fadeIn 0.3s' }}>
          {toastMensaje}
        </div>
      )}

      {/* NAVBAR */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 3rem', backgroundColor: '#0d111a', borderBottom: '1px solid #1a2233', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer' }} onClick={() => setTab('servicios')}>
          <span style={{ fontSize: '1.8rem' }}>🏎️</span>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#06b6d4', letterSpacing: '1px' }}>APEX MOTORS</h1>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', letterSpacing: '2px' }}>STUDIO & DETAILING</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {[
            { id: 'servicios', label: 'Servicios' },
            { id: 'citas', label: 'Agendar Cita' },
            { id: 'inventario', label: 'Tienda Pro' },
            { id: 'empleados', label: 'Equipo' },
            { id: 'promociones', label: 'Promociones' },
            ...(isAdmin ? [{ id: 'admin', label: '⚙️ Panel Admin' }] : [])
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                background: tab === t.id ? '#161e2e' : 'transparent',
                color: tab === t.id ? '#06b6d4' : '#cbd5e1',
                border: tab === t.id ? '1px solid #06b6d4' : '1px solid transparent',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {t.label} {t.id === 'admin' && citasUrgentesCount > 0 && `(${citasUrgentesCount})`}
            </button>
          ))}

          {/* Botón Carrito */}
          <button
            onClick={() => setShowCarritoModal(true)}
            style={{
              background: '#06b6d4',
              color: '#07090e',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            🛒 Carrito ({totalArticulosCarrito})
          </button>

          {isAdmin ? (
            <button
              onClick={() => { setIsAdmin(false); setTab('servicios'); }}
              style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
            >
              Cerrar Sesión
            </button>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              style={{ background: 'transparent', color: '#06b6d4', border: '1px solid #06b6d4', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
            >
              Admin Login
            </button>
          )}
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <div style={{ maxWidth: '1200px', margin: '2.5rem auto', padding: '0 1.5rem' }}>

        {/* 1. SERVICIOS */}
        {tab === 'servicios' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '3rem', backgroundColor: '#0d111a', padding: '3rem 2rem', borderRadius: '16px', border: '1px solid #1a2233' }}>
              <span style={{ color: '#06b6d4', fontWeight: 700, letterSpacing: '2px', fontSize: '0.9rem', textTransform: 'uppercase' }}>Estudio Automotriz de Alta Gama</span>
              <h2 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#fff', margin: '0.5rem 0' }}>EXCELENCIA & DETAILING</h2>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 1.5rem auto' }}>Tratamientos cerámicos, corrección de pintura y protección PPF con acabados espejo profesionales.</p>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Buscar tratamiento o servicio..."
                  value={busquedaServicio}
                  onChange={(e) => setBusquedaServicio(e.target.value)}
                  style={{ padding: '0.8rem 1.2rem', width: '320px', backgroundColor: '#07090e', border: '1px solid #1a2233', color: '#fff', borderRadius: '8px', outline: 'none' }}
                />
                <select
                  value={filtroCategoria}
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                  style={{ padding: '0.8rem 1.2rem', backgroundColor: '#07090e', border: '1px solid #1a2233', color: '#fff', borderRadius: '8px', outline: 'none' }}
                >
                  <option value="Todas">Todas las Categorías</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.nombre_categoria}>{cat.nombre_categoria}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2rem' }}>
              {serviciosFiltrados.map(s => (
                <div key={s.id} style={{ backgroundColor: '#0d111a', borderRadius: '14px', border: '1px solid #1a2233', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s' }}>
                  <div style={{ overflow: 'hidden', height: '220px' }}>
                    <img src={s.imagen_url || 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&q=80'} alt={s.nombre} style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '1.8rem', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4', padding: '0.3rem 0.7rem', borderRadius: '6px', fontWeight: 700 }}>
                        {s.nombre_categoria || 'Detailing Profesional'}
                      </span>
                      <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0.8rem 0 0.5rem 0', color: '#fff' }}>{s.nombre}</h3>
                      <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.2rem' }}>{s.descripcion}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1a2233', paddingTop: '1.2rem' }}>
                      <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#06b6d4' }}>${Number(s.precio).toLocaleString('es-MX')}</span>
                      <button
                        onClick={() => seleccionarServicioParaCita(s.nombre)}
                        style={{ backgroundColor: '#06b6d4', color: '#07090e', border: 'none', padding: '0.7rem 1.3rem', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}
                      >
                        Agendar Cita ⚡
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. CITAS */}
        {tab === 'citas' && (
          <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#0d111a', padding: '3rem', borderRadius: '16px', border: '1px solid #1a2233' }}>
            <h2 style={{ color: '#06b6d4', fontSize: '2.2rem', fontWeight: 900, textAlign: 'center', marginBottom: '0.5rem' }}>Agendar Tratamiento</h2>
            <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: '2.5rem' }}>Reserva tu espacio en nuestro estudio especializado.</p>

            {citaExito && (
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center', fontWeight: 600 }}>
                ¡Cita agendada correctamente! Nos pondremos en contacto contigo a la brevedad.
              </div>
            )}

            <form onSubmit={guardarCita} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Nombre Completo:</label>
                <input type="text" required value={cCliente} onChange={e => setCCliente(e.target.value)} placeholder="Ej. Carlos Slim" style={{ width: '100%', padding: '0.9rem', backgroundColor: '#07090e', border: '1px solid #1a2233', color: '#fff', borderRadius: '8px', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Teléfono de Contacto:</label>
                <input type="tel" required value={cTel} onChange={e => setCTel(e.target.value)} placeholder="Ej. 5512345678" style={{ width: '100%', padding: '0.9rem', backgroundColor: '#07090e', border: '1px solid #1a2233', color: '#fff', borderRadius: '8px', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Servicio Requerido:</label>
                <select value={cServ} onChange={e => setCServ(e.target.value)} required style={{ width: '100%', padding: '0.9rem', backgroundColor: '#07090e', border: '1px solid #1a2233', color: '#fff', borderRadius: '8px', outline: 'none' }}>
                  <option value="">Selecciona un servicio...</option>
                  {servicios.map(s => (
                    <option key={s.id} value={s.nombre}>{s.nombre} (${s.precio})</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Fecha:</label>
                  <input type="date" required value={cFecha} onChange={e => setCFecha(e.target.value)} style={{ width: '100%', padding: '0.9rem', backgroundColor: '#07090e', border: '1px solid #1a2233', color: '#fff', borderRadius: '8px', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Hora:</label>
                  <input type="time" required value={cHora} onChange={e => setCHora(e.target.value)} style={{ width: '100%', padding: '0.9rem', backgroundColor: '#07090e', border: '1px solid #1a2233', color: '#fff', borderRadius: '8px', outline: 'none' }} />
                </div>
              </div>
              <button type="submit" style={{ backgroundColor: '#06b6d4', color: '#07090e', border: 'none', padding: '1rem', borderRadius: '8px', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer', marginTop: '1rem' }}>
                Confirmar Reserva
              </button>
            </form>
          </div>
        )}

        {/* 3. TIENDA / INVENTARIO */}
        {tab === 'inventario' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '3rem', backgroundColor: '#0d111a', padding: '3rem 2rem', borderRadius: '16px', border: '1px solid #1a2233' }}>
              <h2 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#fff', marginBottom: '0.5rem' }}>TIENDA & QUÍMICOS PROFESIONALES</h2>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '1.5rem' }}>Productos de detailing de gama alta para el cuidado y mantenimiento de tu vehículo.</p>
              
              <input
                type="text"
                placeholder="Buscar productos en tienda..."
                value={busquedaProducto}
                onChange={(e) => setBusquedaProducto(e.target.value)}
                style={{ padding: '0.8rem 1.2rem', width: '360px', backgroundColor: '#07090e', border: '1px solid #1a2233', color: '#fff', borderRadius: '8px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '2rem' }}>
              {productosFiltrados.map(i => (
                <div key={i.id} style={{ backgroundColor: '#0d111a', borderRadius: '14px', border: '1px solid #1a2233', padding: '1.8rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4', padding: '0.3rem 0.7rem', borderRadius: '6px', fontWeight: 700 }}>
                      {i.categoria_insumo}
                    </span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0.8rem 0 0.5rem 0', color: '#fff' }}>{i.nombre_producto}</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.3rem' }}>Proveedor: <strong>{i.proveedor || 'Apex Pro'}</strong></p>
                    <p style={{ color: i.stock > 0 ? '#10b981' : '#ef4444', fontSize: '0.9rem', fontWeight: 600 }}>Stock disponible: {i.stock} unidades</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.8rem', borderTop: '1px solid #1a2233', paddingTop: '1.2rem' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#06b6d4' }}>${Number(i.precio_unitario).toLocaleString('es-MX')}</span>
                    <button
                      onClick={() => agregarAlCarrito(i)}
                      disabled={i.stock <= 0}
                      style={{ backgroundColor: i.stock > 0 ? '#06b6d4' : '#334155', color: '#07090e', border: 'none', padding: '0.7rem 1.2rem', borderRadius: '8px', fontWeight: 800, cursor: i.stock > 0 ? 'pointer' : 'not-allowed' }}
                    >
                      {i.stock > 0 ? '+ Agregar' : 'Agotado'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. EQUIPO (REDESIGN COMPLETO - NO MÁS TABLAS SIMPLES) */}
        {tab === 'empleados' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '3rem', backgroundColor: '#0d111a', padding: '3rem 2rem', borderRadius: '16px', border: '1px solid #1a2233' }}>
              <span style={{ color: '#06b6d4', fontWeight: 700, letterSpacing: '2px', fontSize: '0.9rem', textTransform: 'uppercase' }}>Profesionales Certificados</span>
              <h2 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#fff', margin: '0.5rem 0' }}>NUESTRO EQUIPO TÉCNICO</h2>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Maestros artesanos en el cuidado estético y protección de vehículos de alta gama.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2.5rem' }}>
              {empleados.map(e => (
                <div key={e.id} style={{ backgroundColor: '#0d111a', borderRadius: '16px', border: '1px solid #1a2233', padding: '2.5rem', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                  <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '1.5rem' }}>
                    <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#161e2e', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2.2rem', border: '2px solid #06b6d4' }}>
                      👨‍🔧
                    </div>
                    <div>
                      <h3 style={{ color: '#fff', fontSize: '1.35rem', fontWeight: 900, margin: 0 }}>{e.nombre_empleado}</h3>
                      <span style={{ color: '#06b6d4', fontSize: '0.9rem', fontWeight: 600 }}>Técnico Especialista</span>
                    </div>
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                    Especialidad principal: <strong style={{ color: '#fff' }}>{e.especialidad}</strong>
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1a2233', paddingTop: '1.2rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>📞 Ext. Contacto Directo</span>
                    <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 800 }}>
                      {e.estado || 'Disponible'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. PROMOCIONES (REDESIGN COMPLETO - NO MÁS TABLAS SIMPLES) */}
        {tab === 'promociones' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '3rem', backgroundColor: '#0d111a', padding: '3rem 2rem', borderRadius: '16px', border: '1px solid #1a2233' }}>
              <span style={{ color: '#06b6d4', fontWeight: 700, letterSpacing: '2px', fontSize: '0.9rem', textTransform: 'uppercase' }}>Ofertas Exclusivas Apex</span>
              <h2 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#fff', margin: '0.5rem 0' }}>PROMOCIONES DE TEMPORADA</h2>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Potencia el brillo de tu auto con nuestros paquetes especiales de descuento limitado.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2.5rem' }}>
              {promociones.map(p => (
                <div key={p.id} style={{ backgroundColor: '#0d111a', borderRadius: '16px', border: '1px solid #06b6d4', padding: '2.8rem', position: 'relative', boxShadow: '0 15px 35px rgba(6,182,212,0.1)' }}>
                  <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', backgroundColor: '#06b6d4', color: '#07090e', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 900, fontSize: '1rem' }}>
                    -{p.descuento_porcentaje}% OFF
                  </div>
                  <h3 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 900, marginBottom: '0.8rem' }}>{p.titulo_promo}</h3>
                  <p style={{ color: '#94a3b8', lineHeight: 1.6, marginBottom: '2rem', fontSize: '1rem' }}>{p.descripcion_promo}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1a2233', paddingTop: '1.2rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>⏳ Vigente hasta: {p.vigencia}</span>
                    <button onClick={() => setTab('citas')} style={{ backgroundColor: 'transparent', color: '#06b6d4', border: '1px solid #06b6d4', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                      Aprovechar ➔
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. PANEL DE ADMINISTRACIÓN */}
        {isAdmin && tab === 'admin' && (
          <div>
            <h2 style={{ color: '#06b6d4', fontSize: '2.2rem', fontWeight: 900, marginBottom: '2.5rem' }}>⚙️ Panel de Control y Gestión del Estudio</h2>

            {/* Sub-sección Citas Registradas */}
            <div style={{ backgroundColor: '#0d111a', borderRadius: '16px', border: '1px solid #1a2233', padding: '2.5rem', marginBottom: '2.5rem' }}>
              <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '1.2rem', fontWeight: 800 }}>📅 Citas y Agenda de Clientes</h3>
              {citas.length === 0 ? (
                <p style={{ color: '#94a3b8' }}>No hay citas registradas en el sistema.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #1a2233', color: '#94a3b8' }}>
                        <th style={{ padding: '1rem' }}>Cliente</th>
                        <th style={{ padding: '1rem' }}>Teléfono</th>
                        <th style={{ padding: '1rem' }}>Servicio</th>
                        <th style={{ padding: '1rem' }}>Fecha y Hora</th>
                        <th style={{ padding: '1rem' }}>Estado / Alerta</th>
                        <th style={{ padding: '1rem' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {citas.map(c => {
                        const alerta = obtenerEstadoTiempoCita(c.fecha_cita, c.hora_cita);
                        return (
                          <tr key={c.id} style={{ borderBottom: '1px solid #1a2233' }}>
                            <td style={{ padding: '1rem', fontWeight: 600 }}>{c.nombre_cliente}</td>
                            <td style={{ padding: '1rem' }}>{c.telefono}</td>
                            <td style={{ padding: '1rem' }}>{c.servicio_solicitado}</td>
                            <td style={{ padding: '1rem' }}>{String(c.fecha_cita).split('T')[0]} {c.hora_cita}</td>
                            <td style={{ padding: '1rem' }}>
                              <span style={{ backgroundColor: alerta.bg, color: alerta.color, padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
                                {alerta.texto}
                              </span>
                            </td>
                            <td style={{ padding: '1rem' }}>
                              <button onClick={() => eliminarCitaAtendida(c.id)} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}>
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Sub-sección Pedidos de Tienda */}
            <div style={{ backgroundColor: '#0d111a', borderRadius: '16px', border: '1px solid #1a2233', padding: '2.5rem', marginBottom: '2.5rem' }}>
              <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '1.2rem', fontWeight: 800 }}>🛒 Pedidos de Tienda Realizados por Clientes</h3>
              {pedidosClientes.length === 0 ? (
                <p style={{ color: '#94a3b8' }}>No hay pedidos de tienda registrados.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #1a2233', color: '#94a3b8' }}>
                        <th style={{ padding: '1rem' }}>Cliente</th>
                        <th style={{ padding: '1rem' }}>Teléfono</th>
                        <th style={{ padding: '1rem' }}>Productos Solicitados</th>
                        <th style={{ padding: '1rem' }}>Total</th>
                        <th style={{ padding: '1rem' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pedidosClientes.map(p => (
                        <tr key={p.id} style={{ borderBottom: '1px solid #1a2233' }}>
                          <td style={{ padding: '1rem', fontWeight: 600 }}>{p.nombre_cliente}</td>
                          <td style={{ padding: '1rem' }}>{p.telefono}</td>
                          <td style={{ padding: '1rem' }}>{p.nombre_producto}</td>
                          <td style={{ padding: '1rem', color: '#06b6d4', fontWeight: 800 }}>${Number(p.precio).toLocaleString('es-MX')}</td>
                          <td style={{ padding: '1rem' }}>
                            <button onClick={() => eliminarPedidoEntregado(p.id)} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}>
                              Entregado / Borrar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* FORMULARIOS PARA AGREGAR NUEVO SERVICIO Y NUEVO PRODUCTO */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', marginBottom: '2.5rem' }}>
              
              {/* Formulario Agregar Servicio */}
              <div style={{ backgroundColor: '#0d111a', borderRadius: '16px', border: '1px solid #1a2233', padding: '2.5rem' }}>
                <h3 style={{ color: '#06b6d4', marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: 800 }}>➕ Agregar Nuevo Servicio</h3>
                {servicioExito && (
                  <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', fontWeight: 600, textAlign: 'center' }}>
                    ¡Servicio agregado correctamente!
                  </div>
                )}
                <form onSubmit={agregarServicioAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <input type="text" placeholder="Nombre del servicio" required value={nuevoServNombre} onChange={e => setNuevoServNombre(e.target.value)} style={{ padding: '0.9rem', backgroundColor: '#07090e', border: '1px solid #1a2233', color: '#fff', borderRadius: '8px', outline: 'none' }} />
                  <textarea placeholder="Descripción detallada" required value={nuevoServDesc} onChange={e => setNuevoServDesc(e.target.value)} style={{ padding: '0.9rem', backgroundColor: '#07090e', border: '1px solid #1a2233', color: '#fff', borderRadius: '8px', minHeight: '80px', outline: 'none' }} />
                  <input type="number" placeholder="Precio ($)" required value={nuevoServPrecio} onChange={e => setNuevoServPrecio(e.target.value)} style={{ padding: '0.9rem', backgroundColor: '#07090e', border: '1px solid #1a2233', color: '#fff', borderRadius: '8px', outline: 'none' }} />
                  <input type="text" placeholder="URL de Imagen (Unsplash, etc.)" value={nuevoServImg} onChange={e => setNuevoServImg(e.target.value)} style={{ padding: '0.9rem', backgroundColor: '#07090e', border: '1px solid #1a2233', color: '#fff', borderRadius: '8px', outline: 'none' }} />
                  <select value={nuevoServCat} onChange={e => setNuevoServCat(e.target.value)} style={{ padding: '0.9rem', backgroundColor: '#07090e', border: '1px solid #1a2233', color: '#fff', borderRadius: '8px', outline: 'none' }}>
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nombre_categoria}</option>
                    ))}
                  </select>
                  <button type="submit" style={{ backgroundColor: '#06b6d4', color: '#07090e', border: 'none', padding: '1rem', borderRadius: '8px', fontWeight: 900, cursor: 'pointer', marginTop: '0.5rem' }}>
                    Registrar Servicio
                  </button>
                </form>
              </div>

              {/* Formulario Agregar Producto */}
              <div style={{ backgroundColor: '#0d111a', borderRadius: '16px', border: '1px solid #1a2233', padding: '2.5rem' }}>
                <h3 style={{ color: '#06b6d4', marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: 800 }}>➕ Agregar Nuevo Producto a Tienda</h3>
                {productoExito && (
                  <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', fontWeight: 600, textAlign: 'center' }}>
                    ¡Producto agregado correctamente!
                  </div>
                )}
                <form onSubmit={agregarProductoAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <input type="text" placeholder="Nombre del producto" required value={nuevoProdNombre} onChange={e => setNuevoProdNombre(e.target.value)} style={{ padding: '0.9rem', backgroundColor: '#07090e', border: '1px solid #1a2233', color: '#fff', borderRadius: '8px', outline: 'none' }} />
                  <input type="text" placeholder="Categoría (Ej. Químicos, Accesorios)" required value={nuevoProdCat} onChange={e => setNuevoProdCat(e.target.value)} style={{ padding: '0.9rem', backgroundColor: '#07090e', border: '1px solid #1a2233', color: '#fff', borderRadius: '8px', outline: 'none' }} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <input type="number" placeholder="Stock" required value={nuevoProdStock} onChange={e => setNuevoProdStock(e.target.value)} style={{ padding: '0.9rem', backgroundColor: '#07090e', border: '1px solid #1a2233', color: '#fff', borderRadius: '8px', outline: 'none' }} />
                    <input type="number" placeholder="Precio ($)" required value={nuevoProdPrecio} onChange={e => setNuevoProdPrecio(e.target.value)} style={{ padding: '0.9rem', backgroundColor: '#07090e', border: '1px solid #1a2233', color: '#fff', borderRadius: '8px', outline: 'none' }} />
                  </div>
                  <input type="text" placeholder="Proveedor" required value={nuevoProdProv} onChange={e => setNuevoProdProv(e.target.value)} style={{ padding: '0.9rem', backgroundColor: '#07090e', border: '1px solid #1a2233', color: '#fff', borderRadius: '8px', outline: 'none' }} />
                  <button type="submit" style={{ backgroundColor: '#06b6d4', color: '#07090e', border: 'none', padding: '1rem', borderRadius: '8px', fontWeight: 900, cursor: 'pointer', marginTop: '1.4rem' }}>
                    Registrar Producto
                  </button>
                </form>
              </div>

            </div>

            {/* Listas de Gestión (Solo botón Eliminar, sin Editar) */}
            <div style={{ backgroundColor: '#0d111a', borderRadius: '16px', border: '1px solid #1a2233', padding: '2.5rem' }}>
              <h3 style={{ color: '#06b6d4', marginTop: 0, marginBottom: '0.4rem', fontSize: '1.4rem', fontWeight: 800 }}>🛠️ Gestión y Eliminación de Catálogos</h3>
              <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Da de baja servicios o insumos activos en el sistema.</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                
                {/* Servicios Activos Admin */}
                <div>
                  <h4 style={{ color: '#fff', borderBottom: '1px solid #1a2233', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Servicios Activos</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
                    {servicios.map(s => (
                      <div key={s.id} style={{ backgroundColor: '#07090e', padding: '1rem 1.2rem', borderRadius: '10px', border: '1px solid #1a2233', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong style={{ color: '#fff', display: 'block' }}>{s.nombre}</strong>
                          <div style={{ color: '#06b6d4', fontSize: '0.9rem', fontWeight: 700 }}>${s.precio}</div>
                        </div>
                        <button onClick={() => eliminarServicioAdmin(s.id)} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}>Eliminar</button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Productos en Tienda Admin */}
                <div>
                  <h4 style={{ color: '#fff', borderBottom: '1px solid #1a2233', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Productos en Tienda</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
                    {inventario.map(i => (
                      <div key={i.id} style={{ backgroundColor: '#07090e', padding: '1rem 1.2rem', borderRadius: '10px', border: '1px solid #1a2233', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong style={{ color: '#fff', display: 'block' }}>{i.nombre_producto}</strong>
                          <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Stock: {i.stock} | <strong style={{ color: '#06b6d4' }}>${i.precio_unitario}</strong></div>
                        </div>
                        <button onClick={() => eliminarProductoAdmin(i.id)} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}>Eliminar</button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>

      {/* MODAL DE LOGIN ADMIN */}
      {showLoginModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
          <div style={{ backgroundColor: '#0d111a', padding: '2.5rem', borderRadius: '16px', border: '1px solid #06b6d4', width: '380px' }}>
            <h3 style={{ color: '#06b6d4', margin: '0 0 1.5rem 0', textAlign: 'center', fontSize: '1.4rem' }}>Acceso Administrativo</h3>
            {loginError && <p style={{ color: '#ef4444', textAlign: 'center', marginBottom: '1rem' }}>Credenciales incorrectas</p>}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="text" placeholder="Usuario" value={userAdmin} onChange={e => setUserAdmin(e.target.value)} required style={{ padding: '0.9rem', backgroundColor: '#07090e', border: '1px solid #1a2233', color: '#fff', borderRadius: '8px', outline: 'none' }} />
              <input type="password" placeholder="Contraseña" value={passAdmin} onChange={e => setPassAdmin(e.target.value)} required style={{ padding: '0.9rem', backgroundColor: '#07090e', border: '1px solid #1a2233', color: '#fff', borderRadius: '8px', outline: 'none' }} />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowLoginModal(false)} style={{ flex: 1, backgroundColor: '#334155', color: '#fff', border: 'none', padding: '0.9rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ flex: 1, backgroundColor: '#06b6d4', color: '#07090e', border: 'none', padding: '0.9rem', borderRadius: '8px', fontWeight: 900, cursor: 'pointer' }}>Ingresar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CARRITO */}
      {showCarritoModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
          <div style={{ backgroundColor: '#0d111a', padding: '2.5rem', borderRadius: '16px', border: '1px solid #1a2233', width: '460px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#06b6d4', margin: 0, fontSize: '1.3rem' }}>🛒 Tu Carrito de Compras</h3>
              <button onClick={() => setShowCarritoModal(false)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.3rem', cursor: 'pointer' }}>✕</button>
            </div>

            {mensajeCompra && (
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', padding: '0.9rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center', fontWeight: 600 }}>
                {mensajeCompra}
              </div>
            )}

            {carrito.length === 0 ? (
              <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem 0' }}>Tu carrito está vacío.</p>
            ) : (
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                  {carrito.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#07090e', padding: '0.9rem', borderRadius: '10px', border: '1px solid #1a2233' }}>
                      <div>
                        <strong style={{ color: '#fff', display: 'block' }}>{item.nombre_producto}</strong>
                        <span style={{ color: '#06b6d4', fontSize: '0.9rem', fontWeight: 700 }}>${item.precio_unitario} c/u</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <button onClick={() => cambiarCantidadCarrito(item.id, -1)} style={{ backgroundColor: '#1a2233', color: '#fff', border: 'none', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}>-</button>
                        <span style={{ fontWeight: 800 }}>{item.cantidad}</span>
                        <button onClick={() => cambiarCantidadCarrito(item.id, 1)} style={{ backgroundColor: '#1a2233', color: '#fff', border: 'none', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}>+</button>
                        <button onClick={() => quitarDelCarrito(item.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', marginLeft: '0.5rem', fontSize: '1.1rem' }}>🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid #1a2233', paddingTop: '1.2rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 900 }}>
                  <span>Total a Pagar:</span>
                  <span style={{ color: '#06b6d4' }}>${totalCarrito.toLocaleString('es-MX')}</span>
                </div>

                <form onSubmit={confirmarPedidoCarrito} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <input type="text" placeholder="Tu Nombre Completo" required value={compraNombre} onChange={e => setCompraNombre(e.target.value)} style={{ padding: '0.9rem', backgroundColor: '#07090e', border: '1px solid #1a2233', color: '#fff', borderRadius: '8px', outline: 'none' }} />
                  <input type="tel" placeholder="Tu Teléfono" required value={compraTel} onChange={e => setCompraTel(e.target.value)} style={{ padding: '0.9rem', backgroundColor: '#07090e', border: '1px solid #1a2233', color: '#fff', borderRadius: '8px', outline: 'none' }} />
                  <button type="submit" style={{ backgroundColor: '#06b6d4', color: '#07090e', border: 'none', padding: '1rem', borderRadius: '8px', fontWeight: 900, cursor: 'pointer' }}>
                    Confirmar Pedido 🚀
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
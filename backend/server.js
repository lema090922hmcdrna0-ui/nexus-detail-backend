const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Autenticación
app.post('/api/login', async (req, res) => {
    const { usuario, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM administradores WHERE usuario = ? AND password = ?', [usuario, password]);
        if (rows.length > 0) {
            res.json({ success: true, user: rows[0] });
        } else {
            res.status(401).json({ success: false, error: 'Credenciales inválidas' });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 2. Servicios
app.get('/api/servicios', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT s.*, c.nombre_categoria 
            FROM servicios s
            LEFT JOIN categorias c ON s.categoria_id = c.id
            ORDER BY s.id DESC
        `);
        res.json({ success: true, servicios: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/servicios', async (req, res) => {
    let { nombre, descripcion, precio, imagen_url, categoria_id } = req.body;
    const defaultImg = 'https://images.unsplash.com/photo-1617814076367-d759c7d7e738?auto=format&fit=crop&w=800&q=80';
    
    if (!imagen_url || imagen_url.trim() === '') {
        imagen_url = defaultImg;
    }
    if (!categoria_id) {
        categoria_id = 1;
    }

    try {
        await db.query(
            'INSERT INTO servicios (nombre, descripcion, precio, imagen_url, categoria_id) VALUES (?, ?, ?, ?, ?)',
            [nombre, descripcion, precio, imagen_url, categoria_id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.put('/api/servicios/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, categoria_id } = req.body;
    try {
        await db.query(
            'UPDATE servicios SET nombre = ?, descripcion = ?, precio = ?, categoria_id = ? WHERE id = ?',
            [nombre, descripcion, precio, categoria_id, id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.delete('/api/servicios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM servicios WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Pedidos de productos de la tienda realizados por clientes
app.get('/api/pedidos_productos', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM pedidos_productos ORDER BY id DESC');
        res.json({ success: true, pedidos: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/pedidos_productos', async (req, res) => {
    const { nombre_cliente, telefono, nombre_producto, precio } = req.body;
    try {
        await db.query(
            'INSERT INTO pedidos_productos (nombre_cliente, telefono, nombre_producto, precio) VALUES (?, ?, ?, ?)',
            [nombre_cliente, telefono, nombre_producto, precio]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.delete('/api/pedidos_productos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM pedidos_productos WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 3. Categorías
app.get('/api/categorias', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM categorias');
        res.json({ success: true, categorias: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 4. Citas
app.get('/api/citas', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM citas ORDER BY fecha_cita DESC');
        res.json({ success: true, citas: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/citas', async (req, res) => {
    const { nombre_cliente, telefono, servicio_solicitado, fecha_cita, hora_cita, estado, observaciones } = req.body;
    
    const estadoFinal = estado || 'Pendiente';
    const obsFinal = observaciones || 'Generada desde el panel';

    try {
        await db.query(
            'INSERT INTO citas (nombre_cliente, telefono, servicio_solicitado, fecha_cita, hora_cita, estado, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [nombre_cliente, telefono, servicio_solicitado, fecha_cita, hora_cita, estadoFinal, obsFinal]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.put('/api/citas/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre_cliente, telefono, servicio_solicitado, fecha_cita, hora_cita, estado } = req.body;
    try {
        await db.query(
            'UPDATE citas SET nombre_cliente = ?, telefono = ?, servicio_solicitado = ?, fecha_cita = ?, hora_cita = ?, estado = ? WHERE id = ?',
            [nombre_cliente, telefono, servicio_solicitado, fecha_cita, hora_cita, estado, id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.delete('/api/citas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM citas WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 5. Inventario de Insumos
app.get('/api/inventario', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM inventario ORDER BY id DESC');
        res.json({ success: true, inventario: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/inventario', async (req, res) => {
    const { nombre_producto, categoria_insumo, stock, precio_unitario, proveedor } = req.body;
    try {
        await db.query(
            'INSERT INTO inventario (nombre_producto, categoria_insumo, stock, precio_unitario, proveedor) VALUES (?, ?, ?, ?, ?)',
            [nombre_producto, categoria_insumo, stock, precio_unitario, proveedor]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.put('/api/inventario/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre_producto, categoria_insumo, stock, precio_unitario, proveedor } = req.body;
    try {
        await db.query(
            'UPDATE inventario SET nombre_producto = ?, categoria_insumo = ?, stock = ?, precio_unitario = ?, proveedor = ? WHERE id = ?',
            [nombre_producto, categoria_insumo, stock, precio_unitario, proveedor, id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.delete('/api/inventario/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM inventario WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 6. Empleados / Técnicos
app.get('/api/empleados', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM empleados ORDER BY id DESC');
        res.json({ success: true, empleados: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/empleados', async (req, res) => {
    const { nombre_empleado, especialidad, telefono, estado } = req.body;
    const estadoFinal = estado || 'Disponible';
    try {
        await db.query(
            'INSERT INTO empleados (nombre_empleado, especialidad, telefono, estado) VALUES (?, ?, ?, ?)',
            [nombre_empleado, especialidad, telefono, estadoFinal]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.put('/api/empleados/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre_empleado, especialidad, telefono, estado } = req.body;
    try {
        await db.query(
            'UPDATE empleados SET nombre_empleado = ?, especialidad = ?, telefono = ?, estado = ? WHERE id = ?',
            [nombre_empleado, especialidad, telefono, estado, id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.delete('/api/empleados/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM empleados WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 7. Módulo de Consultas
app.get('/api/consultas', async (req, res) => {
    const { tipo } = req.query;
    let query = '';
    try {
        if (tipo === 'servicios_categorias') {
            query = 'SELECT s.id, s.nombre AS servicio, c.nombre_categoria AS categoria, s.precio FROM servicios s LEFT JOIN categorias c ON s.categoria_id = c.id';
        } else if (tipo === 'citas') {
            query = 'SELECT * FROM citas';
        } else if (tipo === 'inventario') {
            query = 'SELECT * FROM inventario';
        } else if (tipo === 'empleados') {
            query = 'SELECT * FROM empleados';
        } else if (tipo === 'administradores') {
            query = 'SELECT id, usuario, nombre_completo FROM administradores';
        } else {
            query = 'SELECT * FROM categorias';
        }
        const [rows] = await db.query(query);
        res.json({ success: true, resultados: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/', (req, res) => {
    res.json({ status: 'API de Nexus Detail funcionando correctamente' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend de Nexus Detail activo en puerto ${PORT}`);
});
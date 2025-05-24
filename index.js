const express = require('express');
require('dotenv').config();
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡API funcionando!');
});

// Obtener todos los productos
app.get('/productos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM productos WHERE estado = "A"');
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).send('Error en la base de datos');
  }
});

// Obtener todos los clientes
app.get('/clientes', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clientes WHERE estado = "A"');
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener clientes:', err);
    res.status(500).send('Error en la base de datos');
  }
});

// Obtener todos los pedidos (encabezados)
app.get('/pedidos', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.id_pedido, p.id_cliente, c.nombre AS nombre_cliente, p.fecha, p.total_pedido, p.estado
      FROM pedido_enc p
      JOIN clientes c ON p.id_cliente = c.id_cliente
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener pedidos:', err);
    res.status(500).send('Error en la base de datos');
  }
});

// Obtener todos los detalles de pedidos
app.get('/detalles', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT d.id_detalle, d.id_pedido, d.id_producto, pr.nombre AS nombre_producto,
             d.precio_venta, d.cantidad_venta, d.subtotal_venta
      FROM pedido_det d
      JOIN productos pr ON d.id_producto = pr.id_producto
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener detalles de pedidos:', err);
    res.status(500).send('Error en la base de datos');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
console.log("El archivo server.js se está ejecutando...");

const authRoutes = require('./routes/auth');
const flightsRoutes = require('./routes/flights');
const hotelsRoutes = require('./routes/hotels');
const carsRoutes = require('./routes/cars');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// // Configuración de MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('Error conectando a MySQL:', err);
  } else {
    console.log('Conectado a MySQL');
  }
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/flights', flightsRoutes);
app.use('/api/hotels', hotelsRoutes);
app.use('/api/cars', carsRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));



require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const shiftRoutes = require('./routes/shifts');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/shifts', shiftRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Error MongoDB:', err));

// Ruta base
app.get('/', (req, res) => {
  res.send('🚀 Job-Control API en funcionamiento');
});

// Arranque del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔊 Servidor corriendo en puerto ${PORT}`));

// server.js - Versión Refactorizada con SOLID

require('dotenv').config(); // Cargar variables de entorno

const { connectDB } = require('./config/dbConfig');
const { createApp } = require('./app');

// ======================================
// INICIALIZAR LA APLICACIÓN
// ======================================

const startServer = async () => {
  try {
    // 1. Conectar a MongoDB
    await connectDB();

    // 2. Crear la aplicación (con middlewares y rutas configuradas)
    const app = createApp();

    // 3. Iniciar el servidor
    const PORT = process.env.PORT || 3005;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
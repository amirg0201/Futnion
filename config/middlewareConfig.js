// config/middlewareConfig.js
// Responsabilidad única: Configurar middlewares

const express = require('express');
const cors = require('cors');
const { getCorsOptions } = require('./corsConfig');

const setupMiddlewares = (app) => {
  // Aplicar la configuración de CORS
  app.use(cors(getCorsOptions()));

  // Middleware para parsear JSON
  app.use(express.json());
};

module.exports = { setupMiddlewares };

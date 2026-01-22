// app.js
// Responsabilidad única: Configurar la aplicación Express

const express = require('express');
const { setupMiddlewares } = require('./config/middlewareConfig');
const UserController = require('./controllers/UserController');
const UserService = require('./services/UserService');
const MatchController = require('./controllers/MatchController');
const MatchService = require('./services/MatchService');
const authMiddleware = require('./middleware/auth');

const createApp = () => {
  const app = express();

  // 1. Configurar middlewares (CORS, JSON parsing, etc.)
  setupMiddlewares(app);

  // 2. Instanciar servicios y controladores (Inyección de dependencias)
  const userService = new UserService();
  const userController = new UserController(userService);
  
  const matchService = new MatchService();
  const matchController = new MatchController(matchService);

  // 3. Crear el middleware de autenticación con el servicio inyectado
  const auth = authMiddleware(userService);

  // 4. Importar rutas
  const userRoutes = require('./routes/UserRoutes');
  const matchRoutes = require('./routes/MatchRoutes');

  // 5. Usar rutas
  app.use('/api/usuarios', userRoutes(userService, auth));
  app.use('/api/partidos', matchRoutes(matchService, auth));

  // 6. Ruta de prueba
  app.get('/', (req, res) => {
    res.json({ message: 'API de Futnion funcionando!' });
  });

  return app;
};

module.exports = { createApp };

// app.js
// Responsabilidad única: Configurar la aplicación Express con inyección de dependencias

const express = require('express');
const { setupMiddlewares } = require('./config/middlewareConfig');

// PRINCIPIO DIP: Importar servicios (no instanciarlos aquí, los inyectaremos)
const PasswordService = require('./services/PasswordService');
const TokenService = require('./services/TokenService');
const UserAuthService = require('./services/UserAuthService');
const UserCRUDService = require('./services/UserCRUDService');
const MatchValidationService = require('./services/MatchValidationService');
const MatchParticipantService = require('./services/MatchParticipantService');
const MatchCRUDService = require('./services/MatchCRUDService');
const UserController = require('./controllers/UserController');
const MatchController = require('./controllers/MatchController');
const authMiddleware = require('./middleware/auth');

const createApp = () => {
  const app = express();

  // 1. Configurar middlewares (CORS, JSON parsing, etc.)
  setupMiddlewares(app);

  // ====================================================
  // 2. INSTANCIAR SERVICIOS CON INYECCIÓN DE DEPENDENCIAS
  // PRINCIPIO DIP: Cada servicio recibe sus dependencias
  // ====================================================

  // Servicios de Usuario
  const passwordService = new PasswordService();
  const tokenService = new TokenService();
  
  // PRINCIPIO DIP: UserAuthService recibe passwordService y tokenService inyectados
  const userAuthService = new UserAuthService(passwordService, tokenService);
  
  const userCRUDService = new UserCRUDService();

  // Servicios de Partido
  const matchValidationService = new MatchValidationService();
  
  // PRINCIPIO DIP: MatchParticipantService recibe matchValidationService inyectado
  const matchParticipantService = new MatchParticipantService(matchValidationService);
  
  // PRINCIPIO DIP: MatchCRUDService recibe matchValidationService inyectado
  const matchCRUDService = new MatchCRUDService(matchValidationService);

  // ====================================================
  // 3. INSTANCIAR CONTROLADORES CON INYECCIÓN DE DEPENDENCIAS
  // PRINCIPIO DIP: Cada controlador recibe los servicios que necesita
  // ====================================================

  // PRINCIPIO DIP: UserController recibe userAuthService y userCRUDService inyectados
  const userController = new UserController(userAuthService, userCRUDService);
  
  // PRINCIPIO DIP: MatchController recibe matchCRUDService y matchParticipantService inyectados
  const matchController = new MatchController(matchCRUDService, matchParticipantService);

  // 4. Crear el middleware de autenticación con el servicio inyectado
  const auth = authMiddleware(userCRUDService);

  // 5. Importar rutas
  const userRoutes = require('./routes/UserRoutes');
  const matchRoutes = require('./routes/MatchRoutes');

  // 6. Usar rutas con dependencias inyectadas
  app.use('/api/usuarios', userRoutes(userAuthService, userCRUDService, auth));
  app.use('/api/partidos', matchRoutes(matchCRUDService, matchParticipantService, auth));

  // 7. Ruta de prueba
  app.get('/', (req, res) => {
    res.json({ message: 'API de Futnion funcionando!' });
  });

  return app;
};

module.exports = { createApp };

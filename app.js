// app.js
// Responsabilidad única: Configurar la aplicación Express con inyección de dependencias

const express = require('express');
const { setupMiddlewares } = require('./config/middlewareConfig');

// Importar servicios
const PasswordService = require('./services/PasswordService');
const TokenService = require('./services/TokenService');
const UserAuthService = require('./services/UserAuthService');
const UserCRUDService = require('./services/UserCRUDService');
const MatchValidationService = require('./services/MatchValidationService');
const MatchParticipantService = require('./services/MatchParticipantService');
const MatchCRUDService = require('./services/MatchCRUDService');
const EventEmitterService = require('./services/EventEmitterService');

// Importar repositorios
const UserRepository = require('./repositories/UserRepository');
const MatchRepository = require('./repositories/MatchRepository');

// Importar listeners
const AuditLogListener = require('./listeners/AuditLogListener');
const NotificationListener = require('./listeners/NotificationListener');
const StatisticsListener = require('./listeners/StatisticsListener');

// Importar controladores y middleware
const UserController = require('./controllers/UserController');
const MatchController = require('./controllers/MatchController');
const authMiddleware = require('./middleware/auth');

const createApp = () => {
  const app = express();

  // 1. Configurar middlewares
  setupMiddlewares(app);

  // ====================================================
  // 2. CREAR REPOSITORIOS (Repository Pattern)
  // ====================================================
  const userRepository = new UserRepository();
  const matchRepository = new MatchRepository();

  // ====================================================
  // 3. CREAR EVENT EMITTER GLOBAL (Observer Pattern)
  // ====================================================
  const eventEmitter = new EventEmitterService();

  // ====================================================
  // 4. INSTANCIAR SERVICIOS CON INYECCIÓN (DIP)
  // ====================================================

  // Servicios de Usuario
  const passwordService = new PasswordService();
  const tokenService = new TokenService();
  
  const userAuthService = new UserAuthService(
    passwordService,
    tokenService,
    userRepository,
    eventEmitter
  );
  
  const userCRUDService = new UserCRUDService(
    userRepository,
    eventEmitter
  );

  // Servicios de Partido
  const matchValidationService = new MatchValidationService();
  
  const matchParticipantService = new MatchParticipantService(
    matchRepository,
    matchValidationService,
    eventEmitter
  );
  
  const matchCRUDService = new MatchCRUDService(
    matchRepository,
    matchValidationService,
    eventEmitter
  );

  // ====================================================
  // 5. ENGANCHAR LISTENERS (Observer Pattern)
  // ====================================================
  const auditListener = new AuditLogListener();
  const notificationListener = new NotificationListener();
  const statisticsListener = new StatisticsListener();

  auditListener.attach(eventEmitter);
  notificationListener.attach(eventEmitter);
  statisticsListener.attach(eventEmitter);

  // ====================================================
  // 6. INSTANCIAR CONTROLADORES (DIP)
  // ====================================================
  const userController = new UserController(userAuthService, userCRUDService);
  const matchController = new MatchController(matchCRUDService, matchParticipantService);

  // 7. Crear middleware de autenticación
  const auth = authMiddleware(userCRUDService);

  // 8. Usar rutas con dependencias inyectadas
  const userRoutes = require('./routes/UserRoutes');
  const matchRoutes = require('./routes/MatchRoutes');

  app.use('/api/usuarios', userRoutes(userAuthService, userCRUDService, auth));
  app.use('/api/partidos', matchRoutes(matchCRUDService, matchParticipantService, auth));

  // 9. Ruta de prueba
  app.get('/', (req, res) => {
    res.json({ message: 'API de Futnion funcionando!' });
  });

  return app;
};

module.exports = { createApp };

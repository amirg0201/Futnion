// services/ServiceFactory.js
/**
 * FACTORY PATTERN: Centraliza la creación de todas las instancias de servicios
 * 
 * BENEFICIOS:
 * ✅ app.js queda limpio (sin lógica de instanciación)
 * ✅ Cambios en cómo se crean servicios = cambios en 1 archivo
 * ✅ Fácil agregar nuevos servicios
 * ✅ Testeable: puedes mockear la factory
 */

const PasswordService = require('./PasswordService');
const TokenService = require('./TokenService');
const UserAuthService = require('./UserAuthService');
const UserCRUDService = require('./UserCRUDService');
const MatchValidationService = require('./MatchValidationService');
const MatchParticipantService = require('./MatchParticipantService');
const MatchCRUDService = require('./MatchCRUDService');
const EventEmitterService = require('./EventEmitterService');

class ServiceFactory {
  /**
   * Crea e inyecta todos los servicios de usuario
   * PRINCIPIO: Factory - encapsula lógica de creación
   */
  static createUserServices() {
    const passwordService = new PasswordService();
    const tokenService = new TokenService();
    const userAuthService = new UserAuthService(passwordService, tokenService);
    const userCRUDService = new UserCRUDService();

    return {
      passwordService,
      tokenService,
      userAuthService,
      userCRUDService,
    };
  }

  /**
   * Crea e inyecta todos los servicios de partido
   * PRINCIPIO: Factory - encapsula lógica de creación
   */
  static createMatchServices() {
    const matchValidationService = new MatchValidationService();
    const matchCRUDService = new MatchCRUDService(matchValidationService);
    const matchParticipantService = new MatchParticipantService(matchValidationService);

    return {
      matchValidationService,
      matchCRUDService,
      matchParticipantService,
    };
  }

  /**
   * Crea el servicio de eventos globales
   * PRINCIPIO: Factory - patrón Singleton (solo una instancia)
   */
  static createEventEmitter() {
    return new EventEmitterService();
  }

  /**
   * Crea TODOS los servicios a la vez
   * Útil para: app.js, testing, inyección global
   */
  static createAllServices() {
    const userServices = this.createUserServices();
    const matchServices = this.createMatchServices();
    const eventEmitter = this.createEventEmitter();

    return {
      ...userServices,
      ...matchServices,
      eventEmitter,
    };
  }
}

module.exports = ServiceFactory;

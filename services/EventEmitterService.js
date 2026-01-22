// services/EventEmitterService.js
/**
 * OBSERVER PATTERN: Sistema centralizado de eventos
 * 
 * BENEFICIOS:
 * joinMatch no conoce notificaciones
 * agregar listeners sin modificar código existente
 * Auditoría, logging, notificaciones sin tocar lógica principal
 */

const EventEmitter = require('events');

class EventEmitterService extends EventEmitter {
  // Definir todos los eventos como constantes
  static EVENTS = {
    // Eventos de Usuario
    USER_REGISTERED: 'user:registered',
    USER_LOGGED_IN: 'user:logged_in',
    USER_DELETED: 'user:deleted',
    USER_UPDATED: 'user:updated',

    // Eventos de Partido
    MATCH_CREATED: 'match:created',
    MATCH_JOINED: 'match:joined',
    MATCH_LEFT: 'match:left',
    MATCH_FULL: 'match:full',
    MATCH_UPDATED: 'match:updated',
    MATCH_DELETED: 'match:deleted',
    PARTICIPANT_REMOVED: 'participant:removed',
  };

  constructor() {
    super();
    // Configurar límite de listeners para producción
    this.setMaxListeners(20);
  }

  /**
   * Emitir evento de usuario registrado
   * PRINCIPIO: Observer - notifica a todos los listeners interesados
   */
  emitUserRegistered(user) {
    this.emit(EventEmitterService.EVENTS.USER_REGISTERED, {
      userId: user._id,
      email: user.email,
      timestamp: new Date(),
    });
  }

  /**
   * Emitir evento de partido creado
   */
  emitMatchCreated(match) {
    this.emit(EventEmitterService.EVENTS.MATCH_CREATED, {
      matchId: match._id,
      creator: match.creator,
      sport: match.sport,
      timestamp: new Date(),
    });
  }

  /**
   * Emitir evento de usuario uniéndose a partido
   */
  emitMatchJoined(match, userId) {
    this.emit(EventEmitterService.EVENTS.MATCH_JOINED, {
      matchId: match._id,
      userId,
      creator: match.creator,
      participantCount: match.participants.length,
      maxParticipants: match.maxParticipants,
      timestamp: new Date(),
    });
  }

  /**
   * Emitir evento de usuario dejando el partido
   */
  emitMatchLeft(match, userId) {
    this.emit(EventEmitterService.EVENTS.MATCH_LEFT, {
      matchId: match._id,
      userId,
      participantCount: match.participants.length,
      timestamp: new Date(),
    });
  }

  /**
   * Emitir evento cuando partido está lleno
   */
  emitMatchFull(match) {
    this.emit(EventEmitterService.EVENTS.MATCH_FULL, {
      matchId: match._id,
      sport: match.sport,
      creator: match.creator,
      participantCount: match.participants.length,
      timestamp: new Date(),
    });
  }

  /**
   * Registrar múltiples listeners a la vez
   * Útil para inicializar desde app.js
   */
  registerAllListeners(...listeners) {
    listeners.forEach(listener => {
      if (listener && typeof listener.attach === 'function') {
        listener.attach(this);
      }
    });
  }
}

module.exports = EventEmitterService;

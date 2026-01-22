// listeners/AuditLogListener.js
/**
 * OBSERVER PATTERN: Listener para auditoría
 * 
 * Escucha eventos y registra todo lo que sucede
 * Útil para: cumplimiento, debugging, análisis
 */

const EventEmitterService = require('../services/EventEmitterService');

class AuditLogListener {
  constructor() {
    this.logs = [];
  }

  /**
   * Enganchar este listener al event emitter
   * PRINCIPIO: Observer - escucha eventos
   */
  attach(eventEmitter) {
    eventEmitter.on(
      EventEmitterService.EVENTS.USER_REGISTERED,
      (data) => this.logUserRegistered(data)
    );

    eventEmitter.on(
      EventEmitterService.EVENTS.MATCH_CREATED,
      (data) => this.logMatchCreated(data)
    );

    eventEmitter.on(
      EventEmitterService.EVENTS.MATCH_JOINED,
      (data) => this.logMatchJoined(data)
    );

    eventEmitter.on(
      EventEmitterService.EVENTS.MATCH_LEFT,
      (data) => this.logMatchLeft(data)
    );

    eventEmitter.on(
      EventEmitterService.EVENTS.PARTICIPANT_REMOVED,
      (data) => this.logParticipantRemoved(data)
    );
  }

  logUserRegistered(data) {
    const log = {
      event: 'USER_REGISTERED',
      userId: data.userId,
      email: data.email,
      timestamp: data.timestamp,
      message: `Usuario ${data.email} registrado`,
    };
    this.logs.push(log);
    console.log(`📝 [AUDIT] ${log.message}`);
  }

  logMatchCreated(data) {
    const log = {
      event: 'MATCH_CREATED',
      matchId: data.matchId,
      creator: data.creator,
      sport: data.sport,
      timestamp: data.timestamp,
      message: `Partido de ${data.sport} creado por ${data.creator}`,
    };
    this.logs.push(log);
    console.log(`📝 [AUDIT] ${log.message}`);
  }

  logMatchJoined(data) {
    const log = {
      event: 'MATCH_JOINED',
      matchId: data.matchId,
      userId: data.userId,
      timestamp: data.timestamp,
      message: `Usuario ${data.userId} se unió al partido ${data.matchId}`,
    };
    this.logs.push(log);
    console.log(`📝 [AUDIT] ${log.message}`);
  }

  logMatchLeft(data) {
    const log = {
      event: 'MATCH_LEFT',
      matchId: data.matchId,
      userId: data.userId,
      timestamp: data.timestamp,
      message: `Usuario ${data.userId} salió del partido ${data.matchId}`,
    };
    this.logs.push(log);
    console.log(`📝 [AUDIT] ${log.message}`);
  }

  logParticipantRemoved(data) {
    const log = {
      event: 'PARTICIPANT_REMOVED',
      matchId: data.matchId,
      userId: data.userId,
      timestamp: data.timestamp,
      message: `Usuario ${data.userId} fue removido del partido ${data.matchId}`,
    };
    this.logs.push(log);
    console.log(`📝 [AUDIT] ${log.message}`);
  }

  /**
   * Obtener todos los logs registrados
   * Útil para debugging y testing
   */
  getLogs() {
    return this.logs;
  }

  /**
   * Limpiar logs
   */
  clearLogs() {
    this.logs = [];
  }
}

module.exports = AuditLogListener;

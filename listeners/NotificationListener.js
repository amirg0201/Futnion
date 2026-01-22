// listeners/NotificationListener.js
/**
 * OBSERVER PATTERN: Listener para notificaciones
 * 
 * Escucha eventos y simula envío de notificaciones
 * En producción: integrar con SendGrid, Twilio, Firebase, etc.
 */

const EventEmitterService = require('../services/EventEmitterService');

class NotificationListener {
  constructor() {
    this.notifications = [];
  }

  /**
   * Enganchar este listener al event emitter
   */
  attach(eventEmitter) {
    eventEmitter.on(
      EventEmitterService.EVENTS.USER_REGISTERED,
      (data) => this.onUserRegistered(data)
    );

    eventEmitter.on(
      EventEmitterService.EVENTS.MATCH_CREATED,
      (data) => this.onMatchCreated(data)
    );

    eventEmitter.on(
      EventEmitterService.EVENTS.MATCH_JOINED,
      (data) => this.onMatchJoined(data)
    );

    eventEmitter.on(
      EventEmitterService.EVENTS.MATCH_FULL,
      (data) => this.onMatchFull(data)
    );
  }

  async onUserRegistered(data) {
    const notification = {
      type: 'USER_WELCOME',
      recipient: data.email,
      subject: 'Bienvenido a Futnion',
      body: `¡Hola! Te registraste exitosamente en Futnion. ¡A jugar!`,
      timestamp: data.timestamp,
    };
    this.notifications.push(notification);
    console.log(`📧 [NOTIF] Email enviado a ${data.email}: ${notification.subject}`);
  }

  async onMatchCreated(data) {
    const notification = {
      type: 'MATCH_CREATED_CONFIRMATION',
      recipient: data.creator,
      subject: `Tu partido de ${data.sport} fue creado`,
      body: `El partido de ${data.sport} fue creado exitosamente`,
      timestamp: data.timestamp,
    };
    this.notifications.push(notification);
    console.log(`📧 [NOTIF] Confirmación enviada al creador`);
  }

  async onMatchJoined(data) {
    const notification = {
      type: 'PARTICIPANT_JOINED',
      recipient: data.creator,
      subject: `Un usuario se unió a tu partido`,
      body: `${data.participantCount}/${data.maxParticipants} participantes confirmados`,
      timestamp: data.timestamp,
    };
    this.notifications.push(notification);
    console.log(`📧 [NOTIF] Notificación al creador: nuevo participante (${data.participantCount}/${data.maxParticipants})`);
  }

  async onMatchFull(data) {
    // Notificar a todos los participantes
    const notification = {
      type: 'MATCH_FULL_ALERT',
      recipient: 'all_participants',
      subject: `¡Tu partido de ${data.sport} está lleno!`,
      body: `Todos los cupos se llenaron. ¡Que disfrutes el partido!`,
      timestamp: data.timestamp,
    };
    this.notifications.push(notification);
    console.log(`📧 [NOTIF] ¡Partido lleno! Notificaciones enviadas a todos los participantes`);
  }

  /**
   * Obtener notificaciones enviadas
   * Útil para testing
   */
  getNotifications() {
    return this.notifications;
  }

  /**
   * Limpiar notificaciones
   */
  clearNotifications() {
    this.notifications = [];
  }

  /**
   * Contar notificaciones por tipo
   */
  countByType(type) {
    return this.notifications.filter(n => n.type === type).length;
  }
}

module.exports = NotificationListener;

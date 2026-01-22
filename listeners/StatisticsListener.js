// listeners/StatisticsListener.js
/**
 * OBSERVER PATTERN: Listener para estadísticas
 * 
 * Escucha eventos y calcula estadísticas en tiempo real
 * Ejemplo: cantidad de partidos creados, usuarios activos, etc.
 */

const EventEmitterService = require('../services/EventEmitterService');

class StatisticsListener {
  constructor() {
    this.stats = {
      totalUsersRegistered: 0,
      totalMatchesCreated: 0,
      totalParticipationsJoined: 0,
      matchesByDate: {},
      userActivity: {},
    };
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
  }

  onUserRegistered(data) {
    this.stats.totalUsersRegistered++;
    console.log(`📊 [STATS] Usuarios registrados: ${this.stats.totalUsersRegistered}`);
  }

  onMatchCreated(data) {
    this.stats.totalMatchesCreated++;
    
    // Agrupar por fecha
    const date = new Date(data.timestamp).toLocaleDateString();
    this.stats.matchesByDate[date] = (this.stats.matchesByDate[date] || 0) + 1;

    // Registrar actividad del usuario
    this.stats.userActivity[data.creator] = {
      matchesCreated: (this.stats.userActivity[data.creator]?.matchesCreated || 0) + 1,
      lastActivity: data.timestamp,
    };

    console.log(`📊 [STATS] Total partidos creados: ${this.stats.totalMatchesCreated}`);
  }

  onMatchJoined(data) {
    this.stats.totalParticipationsJoined++;

    // Registrar actividad del usuario
    if (!this.stats.userActivity[data.userId]) {
      this.stats.userActivity[data.userId] = {};
    }
    this.stats.userActivity[data.userId].participationsJoined = 
      (this.stats.userActivity[data.userId].participationsJoined || 0) + 1;
    this.stats.userActivity[data.userId].lastActivity = data.timestamp;

    console.log(`📊 [STATS] Participaciones: ${this.stats.totalParticipationsJoined}`);
  }

  /**
   * Obtener estadísticas completas
   */
  getStats() {
    return {
      ...this.stats,
      summary: {
        totalUsers: this.stats.totalUsersRegistered,
        totalMatches: this.stats.totalMatchesCreated,
        totalParticipations: this.stats.totalParticipationsJoined,
        activeUsers: Object.keys(this.stats.userActivity).length,
      },
    };
  }

  /**
   * Limpiar estadísticas
   */
  resetStats() {
    this.stats = {
      totalUsersRegistered: 0,
      totalMatchesCreated: 0,
      totalParticipationsJoined: 0,
      matchesByDate: {},
      userActivity: {},
    };
  }
}

module.exports = StatisticsListener;

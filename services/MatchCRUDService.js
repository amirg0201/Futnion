// services/MatchCRUDService.js
/**
 * PRINCIPIO SRP: Operaciones CRUD en partidos
 * PRINCIPIO DIP: Recibe dependencias inyectadas
 * PRINCIPIO REPOSITORY: Delega acceso a datos al repositorio
 * PRINCIPIO OBSERVER: Emite eventos cuando ocurren cambios
 */

class MatchCRUDService {
    /**
     * Constructor con inyección de dependencias
     * PRINCIPIO DIP: Recibe matchRepository, matchValidationService y eventEmitter
     */
    constructor(matchRepository, matchValidationService, eventEmitter = null) {
        this.matchRepository = matchRepository;
        this.matchValidationService = matchValidationService;
        this.eventEmitter = eventEmitter;
    }

    /**
     * Crea un nuevo partido
     * PRINCIPIO OBSERVER: Emite evento cuando se crea
     */
    async createMatch(matchData) {
        try {
            const newMatch = this.matchRepository
                ? await this.matchRepository.create(matchData)
                : null;

            // Emitir evento
            if (this.eventEmitter && newMatch) {
                this.eventEmitter.emitMatchCreated(newMatch);
            }

            return newMatch;
        } catch (error) {
            throw new Error(`Error al crear partido: ${error.message}`);
        }
    }

    /**
     * Obtiene todos los partidos
     * PRINCIPIO REPOSITORY: Delega al repositorio
     */
    async getAllMatches() {
        try {
            return await this.matchRepository.findAll();
        } catch (error) {
            throw new Error(`Error al obtener partidos: ${error.message}`);
        }
    }

    /**
     * Obtiene un partido por ID
     * PRINCIPIO REPOSITORY: Delega al repositorio
     * @param {string} id - ID del partido
     * @returns {Promise<object>} - Datos del partido
     */
    async getMatchById(id) {
        try {
            const match = this.matchRepository
                ? await this.matchRepository.findById(id)
                : null;

            if (!match) throw new Error('Partido no encontrado');
            return match;
        } catch (error) {
            throw new Error(`Error al obtener partido: ${error.message}`);
        }
    }

    /**
     * Actualiza datos de un partido
     * PRINCIPIO SRP: Solo actualiza, sin validaciones de acceso
     * PRINCIPIO REPOSITORY: Delega al repositorio
     * @param {string} id - ID del partido
     * @param {object} data - Datos a actualizar
     * @returns {Promise<object>} - Partido actualizado
     */
    async updateMatch(id, data) {
        try {
            const match = this.matchRepository
                ? await this.matchRepository.update(id, data)
                : null;

            if (!match) throw new Error('Partido no encontrado');

            // Emitir evento de actualización
            if (this.eventEmitter && match) {
                this.eventEmitter.emit('match:updated', {
                    matchId: match._id,
                    timestamp: new Date()
                });
            }

            return match;
        } catch (error) {
            throw new Error(`Error al actualizar partido: ${error.message}`);
        }
    }

    /**
     * Elimina un partido (solo el creador puede)
     * PRINCIPIO SRP: Orquesta eliminación con validación de acceso
     * PRINCIPIO DIP: Delega validación al servicio inyectado
     * PRINCIPIO REPOSITORY: Delega eliminación al repositorio
     * @param {string} matchId - ID del partido
     * @param {string} userId - ID del usuario que intenta eliminar
     * @returns {Promise<object>} - Partido eliminado
     */
    async deleteMatch(matchId, userId) {
        try {
            const match = this.matchRepository
                ? await this.matchRepository.findById(matchId)
                : null;

            if (!match) throw new Error('Partido no encontrado');

            // PRINCIPIO DIP: Delega validación de acceso
            if (!this.matchValidationService.isCreator(match, userId)) {
                throw new Error(
                    'Acceso denegado. Solo el creador puede eliminar este partido.'
                );
            }

            const deletedMatch = await this.matchRepository.delete(matchId);

            // Emitir evento de eliminación
            if (this.eventEmitter) {
                this.eventEmitter.emit('match:deleted', {
                    matchId: matchId,
                    userId: userId,
                    timestamp: new Date()
                });
            }

            return deletedMatch;
        } catch (error) {
            throw new Error(`Error al eliminar partido: ${error.message}`);
        }
    }

    /**
     * Elimina un partido (operación administrativa)
     * No requiere validación de creador
     * PRINCIPIO SRP: Operación simple de borrado
     * PRINCIPIO REPOSITORY: Delega al repositorio
     * @param {string} matchId - ID del partido
     * @returns {Promise<object>} - Partido eliminado
     */
    async deleteAnyMatch(matchId) {
        try {
            const deletedMatch = this.matchRepository
                ? await this.matchRepository.delete(matchId)
                : null;

            if (!deletedMatch) throw new Error('Partido no encontrado');

            // Emitir evento de eliminación administrativa
            if (this.eventEmitter) {
                this.eventEmitter.emit('match:deleted_admin', {
                    matchId: matchId,
                    timestamp: new Date()
                });
            }

            return deletedMatch;
        } catch (error) {
            throw new Error(
                `Error al eliminar partido (admin): ${error.message}`
            );
        }
    }
}

module.exports = MatchCRUDService;

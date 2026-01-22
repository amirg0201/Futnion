// services/MatchParticipantService.js
/**
 * PRINCIPIO SRP: Gestión de participantes en partidos
 * PRINCIPIO DIP: Recibe dependencias inyectadas
 * PRINCIPIO REPOSITORY: Usa repositorio para acceso a datos
 * PRINCIPIO OBSERVER: Emite eventos de participantes
 */

class MatchParticipantService {
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
     * Agrega un usuario a un partido
     * PRINCIPIO OBSERVER: Emite evento cuando se une
     */
    async joinMatch(matchId, userId) {
        try {
            // Obtener partido del repositorio
            const match = this.matchRepository
                ? await this.matchRepository.findById(matchId)
                : null;

            if (!match) throw new Error('Partido no encontrado');

            // Validar que puede unirse
            await this.matchValidationService.validateCanJoinMatch(match, userId);

            // Agregar participante
            if (!match.participants.includes(userId)) {
                match.participants.push(userId);
                const updatedMatch = await this.matchRepository.update(matchId, {
                    participants: match.participants
                });

                // Emitir evento de unión
                if (this.eventEmitter) {
                    this.eventEmitter.emitMatchJoined(updatedMatch, userId);

                    // Si el partido está lleno, emitir evento especial
                    if (updatedMatch.participants.length === updatedMatch.maxParticipants) {
                        this.eventEmitter.emitMatchFull(updatedMatch);
                    }
                }

                return updatedMatch;
            }

            return match;
        } catch (error) {
            throw new Error(`Error al unirse al partido: ${error.message}`);
        }
    }

    /**
     * Remueve un usuario de los participantes de un partido
     * PRINCIPIO SRP: Solo remueve, las validaciones las hace otro servicio
     * @param {string} matchId - ID del partido
     * @param {string} userId - ID del usuario
     * @returns {Promise<object>} - Partido actualizado
     */
    async leaveMatch(matchId, userId) {
        try {
            const match = await Match.findById(matchId);
            if (!match) throw new Error('Partido no encontrado');

            // PRINCIPIO DIP: Delega validaciones al servicio inyectado
            await this.matchValidationService.validateCanLeaveMatch(match, userId);

            // Si validaciones pasaron, remueve el participante
            match.participants = match.participants.filter(
                p => p.toString() !== userId
            );
            return await match.save();
        } catch (error) {
            throw new Error(`Error al abandonar el partido: ${error.message}`);
        }
    }

    /**
     * Remueve un participante de un partido (operación administrativa)
     * No requiere validaciones de cooldown
     * PRINCIPIO SRP: Solo remueve, operación simple
     * @param {string} matchId - ID del partido
     * @param {string} userIdToRemove - ID del usuario a remover
     * @returns {Promise<object>} - Partido actualizado
     */
    async removeParticipant(matchId, userIdToRemove) {
        try {
            const match = await Match.findById(matchId);
            if (!match) throw new Error('Partido no encontrado');

            match.participants = match.participants.filter(
                p => p.toString() !== userIdToRemove
            );
            return await match.save();
        } catch (error) {
            throw new Error(
                `Error al remover participante: ${error.message}`
            );
        }
    }

    /**
     * Obtiene todos los partidos a los que un usuario se ha apuntado
     * PRINCIPIO SRP: Búsqueda específica de participación
     * @param {string} userId - ID del usuario
     * @returns {Promise<array>} - Array de partidos
     */
    async getMyMatches(userId) {
        try {
            return await Match.find({ participants: userId }).populate(
                'creator',
                'username fullName'
            );
        } catch (error) {
            throw new Error(
                `Error al obtener tus partidos: ${error.message}`
            );
        }
    }
}

module.exports = MatchParticipantService;

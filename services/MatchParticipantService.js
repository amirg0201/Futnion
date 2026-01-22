// services/MatchParticipantService.js
// PRINCIPIO SRP: Esta clase tiene UNA única responsabilidad: gestionar participantes en partidos
const Match = require('../models/Match');

class MatchParticipantService {
    /**
     * PRINCIPIO SRP: Separación de responsabilidades
     * Esta clase SOLO se encarga de operaciones con participantes
     * Delega validaciones a MatchValidationService
     * 
     * PRINCIPIO DIP: Recibe MatchValidationService inyectado
     * No lo instancia internamente
     */

    constructor(matchValidationService) {
        this.matchValidationService = matchValidationService;
    }

    /**
     * Agrega un usuario a los participantes de un partido
     * PRINCIPIO SRP: Solo añade, las validaciones las hace otro servicio
     * @param {string} matchId - ID del partido
     * @param {string} userId - ID del usuario
     * @returns {Promise<object>} - Partido actualizado
     */
    async joinMatch(matchId, userId) {
        try {
            const match = await Match.findById(matchId);
            if (!match) throw new Error('Partido no encontrado');

            // PRINCIPIO DIP: Delega validaciones al servicio inyectado
            await this.matchValidationService.validateCanJoinMatch(match, userId);

            // Si validaciones pasaron, añade el participante
            match.participants.push(userId);
            return await match.save();
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

// services/MatchValidationService.js
// PRINCIPIO SRP: Esta clase tiene UNA única responsabilidad: validar reglas de negocio de partidos
const Match = require('../models/Match');

class MatchValidationService {
    /**
     * PRINCIPIO SRP: Separación de responsabilidades
     * Esta clase SOLO se encarga de validar reglas de negocio
     * No realiza CRUD ni modifica la base de datos
     * 
     * PRINCIPIO OCP: Fácil de extender con nuevas validaciones sin modificar CRUD
     */

    /**
     * Valida si un usuario puede unirse a un partido
     * PRINCIPIO SRP: Solo valida, no modifica datos
     * @param {object} match - Objeto del partido
     * @param {string} userId - ID del usuario
     * @throws {Error} - Si hay una validación que falla
     */
    async validateCanJoinMatch(match, userId) {
        try {
            // Validación 1: Verificar que el usuario no es el creador
            const creatorId = match.creator._id?.toString() || match.creator.toString();
            if (creatorId === userId) {
                throw new Error('Ya eres el creador de este partido');
            }

            // Validación 2: Verificar que el usuario no está ya inscrito
            // Convertir todos los ObjectIds a string para comparación correcta
            const participantIds = match.participants.map(p => p._id?.toString() || p.toString());
            if (participantIds.includes(userId)) {
                throw new Error('Ya estás inscrito en este partido');
            }

            // Validación 3: Verificar que hay espacios disponibles
            if (match.participants.length >= match.requiredPlayers) {
                throw new Error('El partido ya está lleno');
            }

            return true;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Valida si un usuario puede abandonar un partido
     * Implementa lógica de cooldown: no puedes salirte 1 hora antes
     * PRINCIPIO SRP: Solo valida, no modifica datos
     * @param {object} match - Objeto del partido
     * @param {string} userId - ID del usuario
     * @throws {Error} - Si hay una validación que falla
     */
    async validateCanLeaveMatch(match, userId) {
        try {
            // Validación 1: Verificar que el usuario está inscrito
            const participantIds = match.participants.map(p => p._id?.toString() || p.toString());
            if (!participantIds.includes(userId)) {
                throw new Error('No estás inscrito en este partido');
            }

            // Validación 2: Validar cooldown (no puedes salirte 1 hora antes)
            const matchTime = new Date(match.MatchDate).getTime();
            const currentTime = Date.now();
            const oneHour = 60 * 60 * 1000;

            if (matchTime - currentTime < oneHour) {
                throw new Error(
                    'No puedes salirte. Falta menos de 1 hora para el partido.'
                );
            }

            return true;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Valida si un usuario es el creador de un partido
     * PRINCIPIO SRP: Validación específica y reutilizable
     * @param {object} match - Objeto del partido
     * @param {string} userId - ID del usuario
     * @returns {boolean} - True si es el creador
     */
    isCreator(match, userId) {
        const creatorId = match.creator._id?.toString() || match.creator.toString();
        return creatorId === userId;
    }
}

module.exports = MatchValidationService;

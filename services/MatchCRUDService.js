// services/MatchCRUDService.js
// PRINCIPIO SRP: Esta clase tiene UNA única responsabilidad: operaciones CRUD en partidos
const Match = require('../models/Match');

class MatchCRUDService {
    /**
     * PRINCIPIO SRP: Separación de responsabilidades
     * Esta clase SOLO se encarga de operaciones CRUD
     * No valida reglas de negocio, solo gestiona datos
     * 
     * PRINCIPIO DIP: Recibe MatchValidationService inyectado
     * para validaciones de acceso (creador vs admin)
     */

    constructor(matchValidationService) {
        this.matchValidationService = matchValidationService;
    }

    /**
     * Crea un nuevo partido
     * PRINCIPIO SRP: Solo crea, sin validaciones complejas
     * @param {object} matchData - Datos del nuevo partido
     * @returns {Promise<object>} - Partido creado
     */
    async createMatch(matchData) {
        try {
            const newMatch = new Match(matchData);
            return await newMatch.save();
        } catch (error) {
            throw new Error(`Error al crear partido: ${error.message}`);
        }
    }

    /**
     * Obtiene todos los partidos disponibles
     * PRINCIPIO SRP: Solo obtiene datos, sin filtros complejos
     * @returns {Promise<array>} - Lista de todos los partidos
     */
    async getAllMatches() {
        try {
            return await Match.find()
                .populate('creator', 'username fullName')
                .sort({ MatchDate: 1 });
        } catch (error) {
            throw new Error(`Error al obtener partidos: ${error.message}`);
        }
    }

    /**
     * Obtiene un partido específico por ID
     * @param {string} id - ID del partido
     * @returns {Promise<object>} - Datos del partido
     */
    async getMatchById(id) {
        try {
            const match = await Match.findById(id)
                .populate('creator', 'username fullName')
                .populate('participants', 'username');

            if (!match) throw new Error('Partido no encontrado');
            return match;
        } catch (error) {
            throw new Error(`Error al obtener partido: ${error.message}`);
        }
    }

    /**
     * Actualiza datos de un partido
     * PRINCIPIO SRP: Solo actualiza, sin validaciones de acceso
     * @param {string} id - ID del partido
     * @param {object} data - Datos a actualizar
     * @returns {Promise<object>} - Partido actualizado
     */
    async updateMatch(id, data) {
        try {
            const match = await Match.findByIdAndUpdate(id, data, {
                new: true
            });
            if (!match) throw new Error('Partido no encontrado');
            return match;
        } catch (error) {
            throw new Error(`Error al actualizar partido: ${error.message}`);
        }
    }

    /**
     * Elimina un partido (solo el creador puede)
     * PRINCIPIO SRP: Orquesta eliminación con validación de acceso
     * PRINCIPIO DIP: Delega validación al servicio inyectado
     * @param {string} matchId - ID del partido
     * @param {string} userId - ID del usuario que intenta eliminar
     * @returns {Promise<object>} - Partido eliminado
     */
    async deleteMatch(matchId, userId) {
        try {
            const match = await Match.findById(matchId);
            if (!match) throw new Error('Partido no encontrado');

            // PRINCIPIO DIP: Delega validación de acceso
            if (!this.matchValidationService.isCreator(match, userId)) {
                throw new Error(
                    'Acceso denegado. Solo el creador puede eliminar este partido.'
                );
            }

            return await Match.findByIdAndDelete(matchId);
        } catch (error) {
            throw new Error(`Error al eliminar partido: ${error.message}`);
        }
    }

    /**
     * Elimina un partido (operación administrativa)
     * No requiere validación de creador
     * PRINCIPIO SRP: Operación simple de borrado
     * @param {string} matchId - ID del partido
     * @returns {Promise<object>} - Partido eliminado
     */
    async deleteAnyMatch(matchId) {
        try {
            const match = await Match.findByIdAndDelete(matchId);
            if (!match) throw new Error('Partido no encontrado');
            return match;
        } catch (error) {
            throw new Error(
                `Error al eliminar partido (admin): ${error.message}`
            );
        }
    }
}

module.exports = MatchCRUDService;

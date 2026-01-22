// services/MatchService.js
const IMatchService = require('../interfaces/IMatchService');
const Match = require('../models/Match'); 

class MatchService extends IMatchService {
    
    async createMatch(matchData) {
        const newMatch = new Match(matchData);
        return await newMatch.save();
    }

    async getAllMatches() {
        return await Match.find()
            .populate('creator', 'username fullName')
            .sort({ MatchDate: 1 });
    }

    async getMatchById(id) {
        const match = await Match.findById(id)
            .populate('creator', 'username fullName')
            .populate('participants', 'username');
        
        if (!match) throw new Error('Partido no encontrado');
        return match;
    }

    async updateMatch(id, data) {
        const match = await Match.findByIdAndUpdate(id, data, { new: true });
        if (!match) throw new Error('Partido no encontrado');
        return match;
    }

    // Regla de negocio: Solo el creador borra SU partido
    async deleteMatch(matchId, userId) {
        const match = await Match.findById(matchId);
        if (!match) throw new Error('Partido no encontrado');

        if (match.creator.toString() !== userId) {
            throw new Error('Acceso denegado. Solo el creador puede eliminar este partido.');
        }

        return await Match.findByIdAndDelete(matchId);
    }

    // Admin: Borra cualquiera
    async deleteAnyMatch(matchId) {
        const match = await Match.findByIdAndDelete(matchId);
        if (!match) throw new Error('Partido no encontrado');
        return match;
    }

    async joinMatch(matchId, userId) {
        const match = await Match.findById(matchId);
        if (!match) throw new Error('Partido no encontrado');
        
        // Validaciones de negocio
        if (match.creator.toString() === userId) throw new Error('Ya eres el creador de este partido');
        if (match.participants.includes(userId)) throw new Error('Ya estás inscrito en este partido');
        if (match.participants.length >= match.requiredPlayers) throw new Error('El partido ya está lleno');

        match.participants.push(userId);
        return await match.save();
    }

    async getMyMatches(userId) {
        return await Match.find({ participants: userId });
    }

    async leaveMatch(matchId, userId) {
        const match = await Match.findById(matchId);
        if (!match) throw new Error('Partido no encontrado');

        // VALIDACIÓN DE COOLDOWN (Lógica de negocio pura)
        const matchTime = new Date(match.MatchDate).getTime();
        const currentTime = Date.now();
        const oneHour = 60 * 60 * 1000;

        if (matchTime - currentTime < oneHour) {
            throw new Error('No puedes salirte. Falta menos de 1 hora para el partido.');
        }

        // Eliminar usuario
        match.participants = match.participants.filter(p => p.toString() !== userId);
        return await match.save();
    }

    async removeParticipant(matchId, userIdToRemove) {
        const match = await Match.findById(matchId);
        if (!match) throw new Error('Partido no encontrado');

        match.participants = match.participants.filter(p => p.toString() !== userIdToRemove);
        return await match.save();
    }
}

module.exports = MatchService;
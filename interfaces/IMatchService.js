// interfaces/IMatchService.js
class IMatchService {
    createMatch(matchData) { throw new Error("Método no implementado"); }
    getAllMatches() { throw new Error("Método no implementado"); }
    getMatchById(id) { throw new Error("Método no implementado"); }
    updateMatch(id, data) { throw new Error("Método no implementado"); }
    deleteMatch(matchId, userId) { throw new Error("Método no implementado"); }
    deleteAnyMatch(matchId) { throw new Error("Método no implementado"); } // Admin
    joinMatch(matchId, userId) { throw new Error("Método no implementado"); }
    leaveMatch(matchId, userId) { throw new Error("Método no implementado"); }
    getMyMatches(userId) { throw new Error("Método no implementado"); }
    removeParticipant(matchId, userIdToRemove) { throw new Error("Método no implementado"); }
}

module.exports = IMatchService;

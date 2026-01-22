// controllers/MatchController.js

class MatchController {
    // Inyección de Dependencia
    constructor(matchService) {
        this.matchService = matchService;
    }

    createMatch = async (req, res) => {
        try {
            // Preparamos los datos uniendo body + usuario del token
            const matchData = {
                ...req.body,
                creator: req.user.id
            };
            const result = await this.matchService.createMatch(matchData);
            res.status(201).json({ msg: 'Partido creado con éxito', match: result });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    };

    getMatches = async (req, res) => {
        try {
            const matches = await this.matchService.getAllMatches();
            res.status(200).json(matches);
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    };

    getMatchById = async (req, res) => {
        try {
            const match = await this.matchService.getMatchById(req.params.id);
            res.status(200).json(match);
        } catch (error) {
            // Podrías mejorar esto detectando si el error es "No encontrado" para mandar 404
            res.status(404).json({ msg: error.message });
        }
    };

    updateMatch = async (req, res) => {
        try {
            const match = await this.matchService.updateMatch(req.params.id, req.body);
            res.status(200).json({ msg: 'Partido actualizado', match });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    };

    deleteMatch = async (req, res) => {
        try {
            await this.matchService.deleteMatch(req.params.id, req.user.id);
            res.status(200).json({ msg: 'Partido eliminado.' });
        } catch (error) {
            // Si el mensaje es de permiso, mandamos 403, si no, 500
            if(error.message.includes('Acceso denegado')) {
                return res.status(403).json({ msg: error.message });
            }
            res.status(500).json({ msg: error.message });
        }
    };

    deleteAnyMatch = async (req, res) => {
        try {
            await this.matchService.deleteAnyMatch(req.params.id);
            res.status(200).json({ msg: 'Partido eliminado por administrador.' });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    };

    joinMatch = async (req, res) => {
        try {
            const result = await this.matchService.joinMatch(req.params.id, req.user.id);
            res.status(200).json({ msg: 'Te has unido al partido', match: result });
        } catch (error) {
            res.status(400).json({ msg: error.message });
        }
    };

    getMyMatches = async (req, res) => {
        try {
            const matches = await this.matchService.getMyMatches(req.user.id);
            res.status(200).json(matches);
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    };

    leaveMatch = async (req, res) => {
        try {
            await this.matchService.leaveMatch(req.params.id, req.user.id);
            res.status(200).json({ msg: 'Has salido del partido exitosamente.' });
        } catch (error) {
            res.status(400).json({ msg: error.message });
        }
    };

    removeParticipant = async (req, res) => {
        try {
            // req.params debe tener :id (partido) y :userId (usuario a borrar)
            await this.matchService.removeParticipant(req.params.id, req.params.userId);
            res.status(200).json({ msg: 'Participante eliminado.' });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    };
}

module.exports = MatchController;
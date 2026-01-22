// controllers/MatchController.js

/**
 * PRINCIPIO SRP: El controlador solo se encarga de HTTP y delegación
 * PRINCIPIO DIP: Recibe servicios inyectados, no los instancia
 * PRINCIPIO ISP: Solo usa los métodos específicos que necesita de cada servicio
 */
class MatchController {
    /**
     * Constructor con inyección de dependencias
     * PRINCIPIO DIP: Recibe tres servicios especializados:
     * - matchCRUDService: Operaciones básicas CRUD
     * - matchParticipantService: Gestión de participantes
     * - matchValidationService: Validaciones de reglas de negocio
     */
    constructor(matchCRUDService, matchParticipantService) {
        this.matchCRUDService = matchCRUDService;
        this.matchParticipantService = matchParticipantService;
    }

    /**
     * Crea un nuevo partido
     * PRINCIPIO DIP: Delega al servicio CRUD
     */
    createMatch = async (req, res) => {
        try {
            const matchData = {
                ...req.body,
                creator: req.user.id
            };
            const result = await this.matchCRUDService.createMatch(matchData);
            res.status(201).json({ msg: 'Partido creado con éxito', match: result });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    };

    /**
     * Obtiene todos los partidos
     * PRINCIPIO DIP: Delega al servicio CRUD
     */
    getMatches = async (req, res) => {
        try {
            const matches = await this.matchCRUDService.getAllMatches();
            res.status(200).json(matches);
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    };

    /**
     * Obtiene un partido por ID
     * PRINCIPIO DIP: Delega al servicio CRUD
     */
    getMatchById = async (req, res) => {
        try {
            const match = await this.matchCRUDService.getMatchById(req.params.id);
            res.status(200).json(match);
        } catch (error) {
            res.status(404).json({ msg: error.message });
        }
    };

    /**
     * Actualiza datos de un partido
     * PRINCIPIO DIP: Delega al servicio CRUD
     */
    updateMatch = async (req, res) => {
        try {
            const match = await this.matchCRUDService.updateMatch(req.params.id, req.body);
            res.status(200).json({ msg: 'Partido actualizado', match });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    };

    /**
     * Elimina un partido (solo el creador)
     * PRINCIPIO DIP: Delega al servicio CRUD con validación de acceso
     */
    deleteMatch = async (req, res) => {
        try {
            await this.matchCRUDService.deleteMatch(req.params.id, req.user.id);
            res.status(200).json({ msg: 'Partido eliminado.' });
        } catch (error) {
            if(error.message.includes('Acceso denegado')) {
                return res.status(403).json({ msg: error.message });
            }
            res.status(500).json({ msg: error.message });
        }
    };

    /**
     * Elimina un partido (operación administrativa)
     * PRINCIPIO DIP: Delega al servicio CRUD (sin validación de acceso)
     */
    deleteAnyMatch = async (req, res) => {
        try {
            await this.matchCRUDService.deleteAnyMatch(req.params.id);
            res.status(200).json({ msg: 'Partido eliminado por administrador.' });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    };

    /**
     * Añade un usuario a un partido
     * PRINCIPIO DIP: Delega al servicio de participantes
     */
    joinMatch = async (req, res) => {
        try {
            const result = await this.matchParticipantService.joinMatch(
                req.params.id,
                req.user.id
            );
            res.status(200).json({ msg: 'Te has unido al partido', match: result });
        } catch (error) {
            res.status(400).json({ msg: error.message });
        }
    };

    /**
     * Obtiene los partidos del usuario autenticado
     * PRINCIPIO DIP: Delega al servicio de participantes
     */
    getMyMatches = async (req, res) => {
        try {
            const matches = await this.matchParticipantService.getMyMatches(
                req.user.id
            );
            res.status(200).json(matches);
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    };

    /**
     * Remueve un usuario de un partido
     * PRINCIPIO DIP: Delega al servicio de participantes
     */
    leaveMatch = async (req, res) => {
        try {
            await this.matchParticipantService.leaveMatch(
                req.params.id,
                req.user.id
            );
            res.status(200).json({ msg: 'Has salido del partido exitosamente.' });
        } catch (error) {
            res.status(400).json({ msg: error.message });
        }
    };

    /**
     * Remueve un participante (operación administrativa)
     * PRINCIPIO DIP: Delega al servicio de participantes
     */
    removeParticipant = async (req, res) => {
        try {
            await this.matchParticipantService.removeParticipant(
                req.params.id,
                req.params.userId
            );
            res.status(200).json({ msg: 'Participante eliminado.' });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    };
}

module.exports = MatchController;
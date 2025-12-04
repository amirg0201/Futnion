const Match = require('../models/Match');

// CREATE: Crear un nuevo partido
exports.createMatch = async (req, res) => {
    try {
        // Creamos el partido con los datos del body Y el ID del usuario que viene del token
        const newMatch = new Match({
            ...req.body,
            creator: req.user.id // <-- Asignamos el creador gracias al middleware
        });
        
        await newMatch.save();
        res.status(201).json({ msg: 'Partido creado con éxito', matchId: newMatch._id });
    } catch (error) {
        res.status(500).json({ msg: 'Hubo un error al crear el partido', error: error.message });
    }
};

// READ: Obtener todos los partidos
exports.getMatches = async (req, res) => {
    try {
        // .populate() reemplaza el ID del creador por sus datos
        // ('creator', 'username fullName') <-- solo trae esos campos
        const matches = await Match.find()
            .populate('creator', 'username fullName')
            .sort({ MatchDate: 1 }); // Ordenar por fecha
            
        res.status(200).json(matches);
    } catch (error) {
        res.status(500).json({ msg: 'Hubo un error al obtener los partidos', error: error.message });
    }
};

// READ: Obtener un partido por su ID
exports.getMatchById = async (req, res) => {
    try {
        const match = await Match.findById(req.params.id)
            .populate('creator', 'username fullName') // Ya tenías este
            .populate('participants', 'username');     // <-- ¡ASEGÚRATE DE AÑADIR ESTE!
            
        if (!match) {
            return res.status(404).json({ msg: 'Partido no encontrado' });
        }
        res.status(200).json(match);
    } catch (error) {
        // ...
    }
};

// UPDATE: Actualizar un partido
exports.updateMatch = async (req, res) => {
    try {
        const match = await Match.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!match) {
            return res.status(404).json({ msg: 'Partido no encontrado' });
        }
        res.status(200).json({ msg: 'Partido actualizado', match });
    } catch (error) {
        res.status(500).json({ msg: 'Hubo un error al actualizar el partido', error: error.message });
    }
};

// DELETE: Eliminar un partido
exports.deleteMatch = async (req, res) => {
    try {
        const match = await Match.findByIdAndDelete(req.params.id);
        if (!match) {
            return res.status(404).json({ msg: 'Partido no encontrado' });
        }
        res.status(200).json({ msg: 'Partido eliminado' });
    } catch (error) {
        res.status(500).json({ msg: 'Hubo un error al eliminar el partido', error: error.message });
    }
};

exports.joinMatch = async (req, res) => {
    try {
        const match = await Match.findById(req.params.id);
        const userId = req.user.id; // ID del usuario que quiere unirse

        if (!match) {
            return res.status(404).json({ msg: 'Partido no encontrado' });
        }

        // 1. Verificar si el usuario ya es el creador
        if (match.creator.toString() === userId) {
            return res.status(400).json({ msg: 'Ya eres el creador de este partido' });
        }
        
        // 2. Verificar si el usuario ya está inscrito
        if (match.participants.includes(userId)) {
            return res.status(400).json({ msg: 'Ya estás inscrito en este partido' });
        }

        // 3. Verificar si hay cupo
        // (Los 'requiredPlayers' menos los que ya se han unido)
        if (match.participants.length >= match.requiredPlayers) {
            return res.status(400).json({ msg: 'El partido ya está lleno' });
        }

        // 4. ¡Todo en orden! Añadimos al usuario
        match.participants.push(userId);
        await match.save();

        res.status(200).json({ msg: 'Te has unido al partido', match });

    } catch (error) {
        res.status(500).json({ msg: 'Hubo un error al unirse al partido', error: error.message });
    }
};

exports.deleteAnyMatch = async (req, res) => {
    // Logic to delete the match by ID...
    console.log("Admin aIntentando borrar partido con ID:", req.params.id);
    res.status(200).json({ msg: "Partido borrado por el Admin" });
};
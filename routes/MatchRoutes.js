const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// 1. IMPORTAR LAS CLASES (Usa Mayúscula inicial)
const MatchController = require('../controllers/MatchController'); // <--- CAMBIO AQUÍ
const MatchService = require('../services/MatchService');

// 2. INSTANCIAR (CREAR LOS OBJETOS)
const matchService = new MatchService();

// Inyectamos el servicio en el controlador
// Aquí usamos 'matchController' (minúscula) para la instancia
const matchController = new MatchController(matchService); // <--- CAMBIO AQUÍ

// --- Rutas del CRUD de Partidos ---

// Rutas Específicas (Deben ir ANTES de las rutas dinámicas como /:id)
router.get('/mis-partidos', auth, matchController.getMyMatches);
router.delete('/admin/:id', auth, adminAuth, matchController.deleteAnyMatch);
router.delete('/:id/participants/:userId', auth, adminAuth, matchController.removeParticipant); // Admin borrar participante

// Rutas Generales
router.get('/', matchController.getMatches);
router.post('/', auth, matchController.createMatch);

// Rutas Dinámicas (Con :id)
router.get('/:id', matchController.getMatchById);
router.put('/:id', auth, matchController.updateMatch);
router.delete('/:id', auth, matchController.deleteMatch);
router.post('/:id/join', auth, matchController.joinMatch);
router.post('/:id/leave', auth, matchController.leaveMatch);

module.exports = router;

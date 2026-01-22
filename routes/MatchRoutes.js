const express = require('express');
const MatchController = require('../controllers/MatchController');
const adminAuth = require('../middleware/adminAuth');

/**
 * PRINCIPIO DIP: Las dependencias son inyectadas como parámetros
 * Esto hace que las rutas sean completamente agnósticas a la implementación
 */
module.exports = (matchCRUDService, matchParticipantService, auth) => {
  const router = express.Router();
  
  // PRINCIPIO DIP: Instanciar el controlador con los servicios inyectados
  const matchController = new MatchController(matchCRUDService, matchParticipantService);

  // --- Rutas del CRUD de Partidos ---

  // Rutas Específicas (Deben ir ANTES de las rutas dinámicas como /:id)
  router.get('/mis-partidos', auth, matchController.getMyMatches);
  router.delete('/admin/:id', auth, adminAuth, matchController.deleteAnyMatch);
  router.delete('/:id/participants/:userId', auth, adminAuth, matchController.removeParticipant);

  // Rutas Generales
  router.get('/', matchController.getMatches);
  router.post('/', auth, matchController.createMatch);

  // Rutas Dinámicas (Con :id)
  router.get('/:id', matchController.getMatchById);
  router.put('/:id', auth, matchController.updateMatch);
  router.delete('/:id', auth, matchController.deleteMatch);
  router.post('/:id/join', auth, matchController.joinMatch);
  router.post('/:id/leave', auth, matchController.leaveMatch);

  return router;
};

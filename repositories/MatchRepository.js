// repositories/MatchRepository.js
/**
 * REPOSITORY PATTERN: Abstrae el acceso a datos de partidos
 * PRINCIPIO: Repository centraliza todas las consultas a BD
 */

const Match = require('../models/Match');

class MatchRepository {
  /**
   * Obtiene todos los partidos
   */
  async findAll() {
    return await Match.find().populate('creator').populate('participants');
  }

  /**
   * Obtiene un partido por ID
   */
  async findById(id) {
    const match = await Match.findById(id)
      .populate('creator')
      .populate('participants');
    if (!match) {
      throw new Error(`Partido con ID ${id} no encontrado`);
    }
    return match;
  }

  /**
   * Obtiene partidos creados por un usuario
   */
  async findByCreator(userId) {
    return await Match.find({ creator: userId })
      .populate('creator')
      .populate('participants');
  }

  /**
   * Obtiene partidos a los que se unió un usuario
   */
  async findByParticipant(userId) {
    return await Match.find({ participants: userId })
      .populate('creator')
      .populate('participants');
  }

  /**
   * Crea un nuevo partido
   */
  async create(matchData) {
    const match = new Match(matchData);
    return await match.save();
  }

  /**
   * Actualiza un partido
   */
  async update(id, updateData) {
    const match = await Match.findByIdAndUpdate(id, updateData, { new: true })
      .populate('creator')
      .populate('participants');
    if (!match) {
      throw new Error(`Partido con ID ${id} no encontrado`);
    }
    return match;
  }

  /**
   * Elimina un partido
   */
  async delete(id) {
    const match = await Match.findByIdAndDelete(id);
    if (!match) {
      throw new Error(`Partido con ID ${id} no encontrado`);
    }
    return match;
  }

  /**
   * Obtiene partidos filtrados por deporte y fecha
   */
  async findBySportAndDate(sport, date) {
    return await Match.find({ sport, date })
      .populate('creator')
      .populate('participants');
  }

  /**
   * Obtiene partidos disponibles (con espacio)
   */
  async findAvailable() {
    return await Match.find({
      $expr: { $lt: [{ $size: '$participants' }, '$maxParticipants'] }
    }).populate('creator').populate('participants');
  }
}

module.exports = MatchRepository;

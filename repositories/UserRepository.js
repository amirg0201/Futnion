// repositories/UserRepository.js
/**
 * REPOSITORY PATTERN: Abstrae el acceso a datos
 * 
 * BENEFICIOS:
 * ✅ Si cambias de MongoDB a PostgreSQL, solo modificas este archivo
 * ✅ Consultas centralizadas en un lugar
 * ✅ Testeable: fácil mockearlo
 * ✅ Servicios no conocen los detalles de acceso a datos
 */

const User = require('../models/User');

class UserRepository {
  /**
   * Obtiene todos los usuarios
   * PRINCIPIO: Repository - centraliza lógica de consulta
   */
  async findAll() {
    return await User.find();
  }

  /**
   * Obtiene un usuario por ID
   */
  async findById(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  /**
   * Obtiene un usuario por email
   */
  async findByEmail(email) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error(`Usuario con email ${email} no encontrado`);
    }
    return user;
  }

  /**
   * Crea un nuevo usuario
   */
  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  /**
   * Actualiza un usuario
   */
  async update(id, updateData) {
    const user = await User.findByIdAndUpdate(id, updateData, { new: true });
    if (!user) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  /**
   * Elimina un usuario
   */
  async delete(id) {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  /**
   * Verifica si existe un usuario con ese email
   */
  async existsByEmail(email) {
    const count = await User.countDocuments({ email });
    return count > 0;
  }
}

module.exports = UserRepository;

// services/UserCRUDService.js
// PRINCIPIO SRP: Esta clase tiene UNA única responsabilidad: operaciones CRUD en usuarios
const User = require('../models/User');

class UserCRUDService {
    /**
     * PRINCIPIO SRP: Separación de responsabilidades
     * Esta clase SOLO se encarga de operaciones CRUD
     * No maneja autenticación, tokens ni hashing
     */

    /**
     * Obtiene todos los usuarios (sin contraseñas)
     * PRINCIPIO ISP: Solo retorna lo que se necesita
     * @returns {Promise<array>} - Lista de usuarios sin contraseña
     */
    async getAllUsers() {
        try {
            return await User.find().select('-password');
        } catch (error) {
            throw new Error(`Error al obtener usuarios: ${error.message}`);
        }
    }

    /**
     * Obtiene un usuario por ID
     * @param {string} id - ID del usuario
     * @returns {Promise<object>} - Datos del usuario
     */
    async getUserById(id) {
        try {
            const user = await User.findById(id).select('-password');
            if (!user) throw new Error('Usuario no encontrado');
            return user;
        } catch (error) {
            throw new Error(`Error al obtener usuario: ${error.message}`);
        }
    }

    /**
     * Actualiza datos de un usuario
     * PRINCIPIO SRP: Solo modifica los datos, sin validación de contraseña
     * @param {string} id - ID del usuario
     * @param {object} data - Datos a actualizar
     * @returns {Promise<object>} - Usuario actualizado
     */
    async updateUser(id, data) {
        try {
            // PRINCIPIO OCP: Fácil de extender para validaciones adicionales
            const user = await User.findByIdAndUpdate(id, data, { 
                new: true, 
                runValidators: true 
            }).select('-password');
            
            if (!user) throw new Error('Usuario no encontrado');
            return user;
        } catch (error) {
            throw new Error(`Error al actualizar usuario: ${error.message}`);
        }
    }

    /**
     * Elimina un usuario
     * @param {string} id - ID del usuario a eliminar
     * @returns {Promise<object>} - Usuario eliminado
     */
    async deleteUser(id) {
        try {
            const user = await User.findByIdAndDelete(id);
            if (!user) throw new Error('Usuario no encontrado');
            return user;
        } catch (error) {
            throw new Error(`Error al eliminar usuario: ${error.message}`);
        }
    }

    /**
     * Busca un usuario por email
     * PRINCIPIO SRP: Método auxiliar específico para búsqueda
     * @param {string} email - Email del usuario
     * @returns {Promise<object|null>} - Usuario encontrado o null
     */
    async getUserByEmail(email) {
        try {
            return await User.findOne({ email });
        } catch (error) {
            throw new Error(`Error al buscar usuario por email: ${error.message}`);
        }
    }
}

module.exports = UserCRUDService;

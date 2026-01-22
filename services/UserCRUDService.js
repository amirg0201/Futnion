// services/UserCRUDService.js
/**
 * PRINCIPIO SRP: Operaciones CRUD de usuarios
 * PRINCIPIO DIP: Recibe UserRepository e EventEmitter inyectados
 * PRINCIPIO REPOSITORY: Delega acceso a datos al repositorio
 * PRINCIPIO OBSERVER: Emite eventos cuando ocurren cambios
 */

class UserCRUDService {
    /**
     * Constructor con inyección de dependencias
     * PRINCIPIO DIP: Recibe userRepository y eventEmitter
     */
    constructor(userRepository, eventEmitter = null) {
        this.userRepository = userRepository;
        this.eventEmitter = eventEmitter;
    }

    /**
     * Obtiene todos los usuarios (sin contraseñas)
     * PRINCIPIO SRP: Solo CRUD, sin validaciones complejas
     * PRINCIPIO REPOSITORY: Delega al repositorio
     * @returns {Promise<array>} - Lista de usuarios
     */
    async getAllUsers() {
        try {
            const users = await this.userRepository.findAll();
            return users.map(user => this._sanitizeUser(user));
        } catch (error) {
            throw new Error(`Error al obtener usuarios: ${error.message}`);
        }
    }

    /**
     * Obtiene un usuario por ID
     * PRINCIPIO REPOSITORY: Usa repositorio para acceso a datos
     */
    async getUserById(id) {
        try {
            const user = await this.userRepository.findById(id);
            return this._sanitizeUser(user);
        } catch (error) {
            throw new Error(`Error al obtener usuario: ${error.message}`);
        }
    }

    /**
     * Actualiza datos de un usuario
     * PRINCIPIO OBSERVER: Emite evento después de actualizar
     */
    async updateUser(id, data) {
        try {
            const user = await this.userRepository.update(id, data);
            
            // Emitir evento de actualización
            if (this.eventEmitter) {
                this.eventEmitter.emit('user:updated', {
                    userId: user._id,
                    email: user.email,
                    timestamp: new Date(),
                });
            }
            
            return this._sanitizeUser(user);
        } catch (error) {
            throw new Error(`Error al actualizar usuario: ${error.message}`);
        }
    }

    /**
     * Elimina un usuario
     * PRINCIPIO OBSERVER: Emite evento cuando se elimina
     */
    async deleteUser(id) {
        try {
            const user = await this.userRepository.delete(id);
            
            // Emitir evento de eliminación
            if (this.eventEmitter) {
                this.eventEmitter.emit('user:deleted', {
                    userId: user._id,
                    email: user.email,
                    timestamp: new Date(),
                });
            }
            
            return user;
        } catch (error) {
            throw new Error(`Error al eliminar usuario: ${error.message}`);
        }
    }

    /**
     * Busca un usuario por email
     * PRINCIPIO REPOSITORY: Delega al repositorio
     */
    async getUserByEmail(email) {
        try {
            const user = await this.userRepository.findByEmail(email);
            return this._sanitizeUser(user);
        } catch (error) {
            throw new Error(`Error al buscar usuario: ${error.message}`);
        }
    }

    /**
     * Verifica si existe un usuario con ese email
     * PRINCIPIO REPOSITORY: Usa método específico del repositorio
     */
    async existsByEmail(email) {
        try {
            return await this.userRepository.existsByEmail(email);
        } catch (error) {
            throw new Error(`Error al verificar email: ${error.message}`);
        }
    }

    /**
     * Sanitizar usuario: eliminar contraseña
     * PRINCIPIO SRP: Método privado para lógica de seguridad
     */
    _sanitizeUser(user) {
        if (!user) return null;
        const userObj = user.toObject?.() || user;
        delete userObj.password;
        return userObj;
    }
}

module.exports = UserCRUDService;

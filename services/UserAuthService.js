// services/UserAuthService.js
/**
 * PRINCIPIO SRP: Autenticación de usuarios
 * PRINCIPIO DIP: Recibe dependencias inyectadas
 * PRINCIPIO OBSERVER: Emite eventos cuando ocurren cambios
 */

class UserAuthService {
    /**
     * Constructor con inyección de dependencias
     * PRINCIPIO DIP: Recibe passwordService, tokenService, userRepository y eventEmitter
     */
    constructor(passwordService, tokenService, userRepository = null, eventEmitter = null) {
        this.passwordService = passwordService;
        this.tokenService = tokenService;
        this.userRepository = userRepository;
        this.eventEmitter = eventEmitter;
    }

    /**
     * Registra un nuevo usuario
     * PRINCIPIO OBSERVER: Emite evento después de registrar
     */
    async register(userData) {
        try {
            const { fullName, email, username, password, valuePlayer } = userData;

            // Validar si el usuario ya existe
            if (this.userRepository) {
                const exists = await this.userRepository.existsByEmail(email);
                if (exists) {
                    throw new Error('El usuario ya existe con ese email');
                }
            }

            // Delega hashing al servicio inyectado
            const hashedPassword = await this.passwordService.hashPassword(password);

            // Crear nuevo usuario usando repositorio
            const newUser = this.userRepository
                ? await this.userRepository.create({
                    fullName,
                    email,
                    username,
                    password: hashedPassword,
                    valuePlayer
                  })
                : null;

            // Emitir evento de usuario registrado
            if (this.eventEmitter && newUser) {
                this.eventEmitter.emitUserRegistered(newUser);
            }

            return newUser;
        } catch (error) {
            throw new Error(`Error al registrar usuario: ${error.message}`);
        }
    }

    /**
     * Login de usuario
     * PRINCIPIO OBSERVER: Emite evento después de login
     */
    async login(email, password) {
        try {
            // Buscar usuario por email
            const user = this.userRepository
                ? await this.userRepository.findByEmail(email)
                : null;

            if (!user) {
                throw new Error('Credenciales inválidas');
            }

            // Verificar contraseña
            const passwordMatches = await this.passwordService.comparePasswords(
                password,
                user.password
            );

            if (!passwordMatches) {
                throw new Error('Credenciales inválidas');
            }

            // Generar token
            const token = this.tokenService.generateToken({ userId: user._id });

            // Emitir evento de login
            if (this.eventEmitter) {
                this.eventEmitter.emit('user:logged_in', {
                    userId: user._id,
                    email: user.email,
                    timestamp: new Date(),
                });
            }

            return { user, token };
        } catch (error) {
            throw new Error(`Error al login: ${error.message}`);
        }
    }

    /**
     * Autentica un usuario y genera un token
     * PRINCIPIO SRP: Orquesta el login usando otros servicios
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña del usuario
     * @returns {Promise<object>} - Token y datos del usuario
     */
    async login(email, password) {
        try {
            // Buscar usuario por email
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('Credenciales inválidas (Usuario no encontrado)');
            }

            // PRINCIPIO DIP: Delega comparación de contraseña al servicio inyectado
            const isMatch = await this.passwordService.comparePasswords(
                password,
                user.password
            );

            if (!isMatch) {
                throw new Error('Credenciales inválidas (Contraseña incorrecta)');
            }

            // PRINCIPIO DIP: Delega generación de token al servicio inyectado
            const payload = {
                user: {
                    id: user._id,
                    email: user.email,
                    username: user.username,
                    role: user.role
                }
            };

            const token = this.tokenService.generateToken(payload, '2h');

            // No retornamos la contraseña en la respuesta
            return {
                token,
                user: {
                    _id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    username: user.username,
                    role: user.role
                }
            };
        } catch (error) {
            throw new Error(`Error en login: ${error.message}`);
        }
    }
}

module.exports = UserAuthService;

// services/UserAuthService.js
// PRINCIPIO SRP: Esta clase tiene UNA única responsabilidad: autenticación de usuarios
const User = require('../models/User');

class UserAuthService {
    /**
     * PRINCIPIO SRP: Separación de responsabilidades
     * Esta clase SOLO se encarga de autenticación (registro y login)
     * Delega hashing a PasswordService y tokens a TokenService
     * 
     * PRINCIPIO DIP: Recibe las dependencias inyectadas
     * No crea instancias de PasswordService o TokenService
     */

    constructor(passwordService, tokenService) {
        this.passwordService = passwordService;
        this.tokenService = tokenService;
    }

    /**
     * Registra un nuevo usuario
     * PRINCIPIO SRP: Orquesta el registro usando otros servicios
     * @param {object} userData - Datos del nuevo usuario
     * @returns {Promise<object>} - Usuario creado
     */
    async register(userData) {
        try {
            const { fullName, email, username, password, valuePlayer } = userData;

            // Validar si el usuario ya existe
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new Error('El usuario ya existe con ese email');
            }

            // PRINCIPIO DIP: Delega hashing al servicio inyectado
            const hashedPassword = await this.passwordService.hashPassword(password);

            // Crear nuevo usuario
            const newUser = new User({
                fullName,
                email,
                username,
                password: hashedPassword,
                valuePlayer
            });

            return await newUser.save();
        } catch (error) {
            throw new Error(`Error al registrar usuario: ${error.message}`);
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

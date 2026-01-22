// services/TokenService.js
// PRINCIPIO SRP: Esta clase tiene UNA única responsabilidad: generar y verificar JWT
const jwt = require('jsonwebtoken');
require('dotenv').config();

class TokenService {
    /**
     * PRINCIPIO SRP: Separación de responsabilidades
     * Esta clase SOLO se encarga de operaciones con JWT
     * No mezcla lógica de BD, autenticación o hashing
     */

    constructor() {
        this.secret = process.env.JWT_SECRET;
        if (!this.secret) {
            throw new Error('Error de configuración: JWT_SECRET no definido');
        }
    }

    /**
     * Genera un JWT para un usuario
     * PRINCIPIO ISP: El payload es específico y no contiene datos innecesarios
     * @param {object} userPayload - Datos del usuario para el token
     * @param {string} expiresIn - Tiempo de expiración (ej: '2h')
     * @returns {string} - Token JWT
     */
    generateToken(userPayload, expiresIn = '2h') {
        try {
            // PRINCIPIO SRP: Solo nos preocupamos por generar el token
            return jwt.sign(userPayload, this.secret, { expiresIn });
        } catch (error) {
            throw new Error(`Error al generar token: ${error.message}`);
        }
    }

    /**
     * Verifica y decodifica un JWT
     * @param {string} token - Token a verificar
     * @returns {object} - Payload decodificado
     */
    verifyToken(token) {
        try {
            return jwt.verify(token, this.secret);
        } catch (error) {
            throw new Error(`Token no válido: ${error.message}`);
        }
    }
}

module.exports = TokenService;

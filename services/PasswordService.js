// services/PasswordService.js
// PRINCIPIO SRP: Esta clase tiene UNA única responsabilidad: gestionar hashing de contraseñas
const bcrypt = require('bcryptjs');

class PasswordService {
    /**
     * PRINCIPIO SRP: Separación de responsabilidades
     * Esta clase SOLO se encarga de operaciones criptográficas
     * No mezcla lógica de autenticación, BD, o tokens
     */

    /**
     * Hash una contraseña con bcrypt
     * @param {string} password - Contraseña en texto plano
     * @returns {Promise<string>} - Contraseña hasheada
     */
    async hashPassword(password) {
        try {
            const salt = await bcrypt.genSalt(10);
            return await bcrypt.hash(password, salt);
        } catch (error) {
            throw new Error(`Error al hashear contraseña: ${error.message}`);
        }
    }

    /**
     * Compara una contraseña en texto plano con su hash
     * @param {string} plainPassword - Contraseña en texto plano
     * @param {string} hashedPassword - Contraseña hasheada
     * @returns {Promise<boolean>} - True si coinciden
     */
    async comparePasswords(plainPassword, hashedPassword) {
        try {
            return await bcrypt.compare(plainPassword, hashedPassword);
        } catch (error) {
            throw new Error(`Error al comparar contraseñas: ${error.message}`);
        }
    }
}

module.exports = PasswordService;

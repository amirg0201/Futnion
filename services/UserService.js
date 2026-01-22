// services/UserService.js
const IUserService = require('../interfaces/IUserService');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class UserService extends IUserService {

    async register(userData) {
        const { fullName, email, username, password, valuePlayer } = userData;

        // 1. Validar si ya existe (Opcional pero recomendado)
        // const existingUser = await User.findOne({ email });
        // if (existingUser) throw new Error('El usuario ya existe');

        // 2. Hashear contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Crear usuario
        const newUser = new User({
            fullName,
            email,
            username,
            password: hashedPassword,
            valuePlayer
        });

        return await newUser.save();
    }

    async login(email, password) {
        // 1. Buscar usuario
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Credenciales inválidas (Usuario no encontrado)');
        }

        // 2. Comparar contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Credenciales inválidas (Contraseña incorrecta)');
        }

        // 3. Generar Token JWT
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error('Error de configuración: JWT_SECRET no definido');

        const payload = {
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                role: user.role // Asegúrate de tener role en tu modelo si lo usas
            }
        };

        const token = jwt.sign(payload, secret, { expiresIn: '2h' });

        // Retornamos el token y los datos del usuario necesarios
        return { token, user };
    }

    async getAllUsers() {
        return await User.find().select('-password'); // Excluimos la contraseña por seguridad
    }

    async getUserById(id) {
        const user = await User.findById(id).select('-password');
        if (!user) throw new Error('Usuario no encontrado');
        return user;
    }

    async updateUser(id, data) {
        // OJO: Si actualizan la contraseña aquí, deberías hashearla de nuevo.
        // Por ahora asumimos actualización de datos básicos.
        const user = await User.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select('-password');
        if (!user) throw new Error('Usuario no encontrado');
        return user;
    }

    async deleteUser(id) {
        const user = await User.findByIdAndDelete(id);
        if (!user) throw new Error('Usuario no encontrado');
        return user;
    }
}

module.exports = UserService;
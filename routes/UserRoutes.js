const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Importamos el middleware de seguridad

// 1. IMPORTAR LAS CLASES (Mayúscula inicial)
const UserController = require('../controllers/UserController');
const UserService = require('../services/UserService');

// 2. INSTANCIAR (Cableado de dependencias)
const userService = new UserService();
const userController = new UserController(userService); // Inyectamos el servicio

// --- Rutas de Autenticación ---

// Login (Pública)
router.post('/login', userController.loginUser);

// Registro / Crear Usuario (Pública)
router.post('/', userController.createUser); 


// --- Rutas del CRUD de Usuarios (Protegidas) ---

// READ: Obtener todos (Solo admins deberían poder, o usuarios autenticados)
router.get('/', auth, userController.getUsers);

// READ: Obtener un usuario por ID
router.get('/:id', auth, userController.getUserById);

// UPDATE: Actualizar usuario
router.put('/:id', auth, userController.updateUser);

// DELETE: Eliminar usuario
router.delete('/:id', auth, userController.deleteUser);

module.exports = router;
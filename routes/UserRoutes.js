const express = require('express');
const UserController = require('../controllers/UserController');
const adminAuth = require('../middleware/adminAuth');

// PRINCIPIO DIP: Las dependencias son inyectadas como parámetros
module.exports = (userService, auth) => {
  const router = express.Router();
  
  // Instanciar el controlador con el servicio inyectado
  const userController = new UserController(userService);

  // --- Rutas de Autenticación ---

  // Login (Pública)
  router.post('/login', userController.loginUser);

  // Registro / Crear Usuario (Pública)
  router.post('/', userController.createUser); 

  // --- Rutas del CRUD de Usuarios (Protegidas) ---

  // READ: Obtener todos (Solo admins deberían poder)
  router.get('/', auth, adminAuth, userController.getUsers);

  // READ: Obtener un usuario por ID
  router.get('/:id', auth, userController.getUserById);

  // UPDATE: Actualizar usuario
  router.put('/:id', auth, userController.updateUser);

  // DELETE: Eliminar usuario
  router.delete('/:id', auth, adminAuth, userController.deleteUser);

  return router;
};
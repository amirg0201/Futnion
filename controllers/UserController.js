// controllers/UserController.js

/**
 * PRINCIPIO SRP: El controlador solo se encarga de HTTP y delegación
 * PRINCIPIO DIP: Recibe servicios inyectados, no los instancia
 * PRINCIPIO ISP: Solo usa los métodos que necesita de cada servicio
 */
class UserController {
    /**
     * Constructor con inyección de dependencias
     * PRINCIPIO DIP: Recibe dos servicios especializados
     * - userAuthService: Para autenticación (login, registro)
     * - userCRUDService: Para operaciones CRUD
     */
    constructor(userAuthService, userCRUDService) {
        this.userAuthService = userAuthService;
        this.userCRUDService = userCRUDService;
    }

    /**
     * Crea un nuevo usuario (registro)
     * PRINCIPIO DIP: Delega al servicio de autenticación
     */
    createUser = async (req, res) => {
        try {
            const newUser = await this.userAuthService.register(req.body);
            res.status(201).json({ msg: 'Usuario creado con éxito', userId: newUser._id });
        } catch (error) {
            res.status(500).json({ msg: 'Hubo un error al crear el usuario', error: error.message });
        }
    };

    /**
     * Autentica un usuario y genera token
     * PRINCIPIO DIP: Delega al servicio de autenticación
     */
    loginUser = async (req, res) => {
        try {
            const { email, password } = req.body;
            const result = await this.userAuthService.login(email, password);
            
            res.status(200).json({ 
                msg: 'Login exitoso', 
                token: result.token, 
                userId: result.user._id, 
                role: result.user.role 
            });
        } catch (error) {
            const status = error.message.includes('Credenciales') ? 400 : 500;
            res.status(status).json({ msg: error.message });
        }
    };

    /**
     * Obtiene todos los usuarios
     * PRINCIPIO DIP: Delega al servicio CRUD
     */
    getUsers = async (req, res) => {
        try {
            const users = await this.userCRUDService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ msg: 'Error al obtener usuarios', error: error.message });
        }
    };

    /**
     * Obtiene un usuario por ID
     * PRINCIPIO DIP: Delega al servicio CRUD
     */
    getUserById = async (req, res) => {
        try {
            const user = await this.userCRUDService.getUserById(req.params.id);
            res.status(200).json(user);
        } catch (error) {
            res.status(404).json({ msg: error.message });
        }
    };

    /**
     * Actualiza datos de un usuario
     * PRINCIPIO DIP: Delega al servicio CRUD
     */
    updateUser = async (req, res) => {
        try {
            const updatedUser = await this.userCRUDService.updateUser(req.params.id, req.body);
            res.status(200).json({ msg: 'Usuario actualizado', usuario: updatedUser });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    };

    /**
     * Elimina un usuario
     * PRINCIPIO DIP: Delega al servicio CRUD
     */
    deleteUser = async (req, res) => {
        try {
            await this.userCRUDService.deleteUser(req.params.id);
            res.status(200).json({ msg: 'Usuario eliminado con éxito' });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    };
}

module.exports = UserController;
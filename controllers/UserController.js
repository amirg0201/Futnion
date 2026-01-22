// controllers/UserController.js

class UserController {
    // Inyección de Dependencia
    constructor(userService) {
        this.userService = userService;
    }

    createUser = async (req, res) => {
        try {
            const newUser = await this.userService.register(req.body);
            res.status(201).json({ msg: 'Usuario creado con éxito', userId: newUser._id });
        } catch (error) {
            res.status(500).json({ msg: 'Hubo un error al crear el usuario', error: error.message });
        }
    };

    loginUser = async (req, res) => {
        try {
            const { email, password } = req.body;
            // Delegamos toda la lógica de validación y token al servicio
            const result = await this.userService.login(email, password);
            
            res.status(200).json({ 
                msg: 'Login exitoso', 
                token: result.token, 
                userId: result.user._id, 
                role: result.user.role 
            });
        } catch (error) {
            // Si el error es de credenciales, podríamos devolver 400
            const status = error.message.includes('Credenciales') ? 400 : 500;
            res.status(status).json({ msg: error.message });
        }
    };

    getUsers = async (req, res) => {
        try {
            const users = await this.userService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ msg: 'Error al obtener usuarios', error: error.message });
        }
    };

    getUserById = async (req, res) => {
        try {
            const user = await this.userService.getUserById(req.params.id);
            res.status(200).json(user);
        } catch (error) {
            res.status(404).json({ msg: error.message });
        }
    };

    updateUser = async (req, res) => {
        try {
            const updatedUser = await this.userService.updateUser(req.params.id, req.body);
            res.status(200).json({ msg: 'Usuario actualizado', usuario: updatedUser });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    };

    deleteUser = async (req, res) => {
        try {
            await this.userService.deleteUser(req.params.id);
            res.status(200).json({ msg: 'Usuario eliminado con éxito' });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    };
}

module.exports = UserController;
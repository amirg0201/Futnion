// interfaces/IUserService.js
class IUserService {
    register(_userData) { throw new Error("Método no implementado"); }
    login(_email, _password) { throw new Error("Método no implementado"); }
    getAllUsers() { throw new Error("Método no implementado"); }
    getUserById(_id) { throw new Error("Método no implementado"); }
    updateUser(_id, _data) { throw new Error("Método no implementado"); }
    deleteUser(_id) { throw new Error("Método no implementado"); }
}

module.exports = IUserService;

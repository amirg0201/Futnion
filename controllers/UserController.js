const User = require('../models/User');

// Crear el CRUD y sus funciones

// CREAR UN USUARIO
exports.createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ msg: 'Usuario creado con exito', userId: newUser._id});
  } catch (error) {
    res.status(201).json({ msg: ' Error al crear usuario', error: error.message});
  }
};

// OBTENER USUARIOS
exports.getUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(201).json(users);
  } catch (error) {
    res.status(201).json({ msg: ' Error al obtener usuarios', error: error.message});
  }
}

// OBTENER USUARIO POR ID
exports.getUserByID = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado'});
    }
    res.status().json(user)
  } catch (error) {
    res.status(500).json({ msg: 'Hubo un error al obtener el usuario', error: error.message });
  }
}

// Actualizar Usuarios
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {new: true});
    
    if (!updatedUser) {
      return res.status(404).json({ msg: 'Usuario no encontrado'});
    }
    res.status(200).json({ msg: 'Usuario actualizado con exito', usuario: updatedUser })
  } catch (error) {
    res.status(500).json({ msg: 'Hubo un error al obtener el usuario', error: error.message });
  }
}

//  Eliminar Usuarios
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado'});
    }
    res.status(200).json({ msg: 'Usuario actualizado con exito', usuario: updatedUser })
  } catch (error) {
    res.status(500).json({ msg: 'Hubo un error al obtener el usuario', error: error.message });
  }
}

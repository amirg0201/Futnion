const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // 1. Obtener el token del header
    const token = req.header('Authorization');

    // 2. Verificar si no hay token
    if (!token) {
        return res.status(401).json({ msg: 'No hay token, permiso no válido' });
    }

    // 3. Quitar la palabra 'Bearer' (si es que existe)
    const aToken = token.split(' ')[1] || token;

    // 4. Verificar el token
    try {
        const decoded = jwt.verify(aToken, process.env.JWT_SECRET);
        req.user = decoded.user; // Añadimos el payload del usuario (con su ID) al objeto req
        next(); // El token es válido, continuamos a la ruta
    } catch (error) {
        res.status(401).json({ msg: 'Token no es válido' });
    }
};
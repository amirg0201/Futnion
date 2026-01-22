// config/corsConfig.js
// Responsabilidad única: Configurar CORS

const getCorsOptions = () => {
  const allowedOrigins = [
    'https://futnion.vercel.app',
    'http://localhost:5173', // Para desarrollo local
  ];

  return {
    origin: function (origin, callback) {
      // Permitir peticiones sin origen (como Postman)
      if (!origin) return callback(null, true);

      // Si el origen está en nuestra lista blanca, permitir
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        // Rechazar el acceso si el origen no está en la lista
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };
};

module.exports = { getCorsOptions };

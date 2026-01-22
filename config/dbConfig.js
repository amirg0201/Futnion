// config/dbConfig.js
// Responsabilidad única: Conectar a MongoDB

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/FutnionDB';
    
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado a MongoDB');
    
    return mongoose;
  } catch (err) {
    console.error('❌ Error conectando a MongoDB:', err);
    process.exit(1); // Terminar el proceso si la conexión falla
  }
};

module.exports = { connectDB };

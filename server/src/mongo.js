const mongoose = require('mongoose');

async function connectMongo() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI nao foi definida. Configure a string do MongoDB Atlas no arquivo .env.');
  }

  await mongoose.connect(uri, {
    dbName: 'acao_social'
  });

  console.log('MongoDB Atlas conectado.');
}

function getMongoStatus() {
  return mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
}

module.exports = { connectMongo, getMongoStatus };

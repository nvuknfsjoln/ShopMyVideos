const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB verbunden: ${conn.connection.host}`);
  } catch (error) {
    console.error('Fehler bei der Datenbankverbindung:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

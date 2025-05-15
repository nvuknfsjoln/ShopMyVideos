import mongoose from "mongoose";
import dotenv from "dotenv";
import runWorker from "./worker.js";

dotenv.config();

async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB verbunden");

    await runWorker(); // einmal starten, kannst du später per setInterval loopen lassen
  } catch (err) {
    console.error("❌ Fehler beim Start:", err);
  }
}

start();

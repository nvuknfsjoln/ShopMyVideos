import mongoose from "mongoose";
import dotenv from "dotenv";
import runWorker from "./worker.js";

dotenv.config();

async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB verbunden");

    // Worker starten
    await runWorker();

    // Optional regelmäßig
    // setInterval(runWorker, 30 * 1000);
  } catch (err) {
    console.error("❌ Fehler beim Start:", err);
  }
}

start();

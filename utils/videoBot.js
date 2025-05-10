// utils/videoBot.js

const axios = require('axios');
const { VIDEO_BOT_API_URL, VIDEO_BOT_API_KEY } = require('../config/constants');

// Beispiel einer Funktion zum Übermitteln von Video-Daten an eine externe API
const processVideo = async (videoId, videoUrl) => {
  try {
    const response = await axios.post(`${VIDEO_BOT_API_URL}/process`, {
      videoId,
      videoUrl,
      apiKey: VIDEO_BOT_API_KEY
    });
    console.log('Video verarbeitet:', response.data);
  } catch (error) {
    console.error('Fehler bei der Videoverarbeitung:', error);
  }
};

module.exports = { processVideo };

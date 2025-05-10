// utils/fileHelper.js

const fs = require('fs');
const path = require('path');
const { VIDEO_UPLOAD_DIR } = require('../config/constants');

// Funktion zum Speichern einer Datei
const saveFile = (file) => {
  const uploadPath = path.join(VIDEO_UPLOAD_DIR, file.originalname);
  fs.writeFileSync(uploadPath, file.buffer);
  return uploadPath;
};

// Funktion zum Validieren von Dateiformaten
const validateFileType = (file, allowedTypes) => {
  const fileType = file.mimetype.split('/')[1];
  if (!allowedTypes.includes(fileType)) {
    throw new Error(`Ungültiger Dateityp: ${fileType}`);
  }
  return true;
};

module.exports = { saveFile, validateFileType };

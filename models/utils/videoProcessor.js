const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const { uploadToBackblaze } = require('./b2');

function removeMetadataAndCompress(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        '-vf', 'scale=-2:1080',
        '-c:v', 'libx264',
        '-preset', 'slow',
        '-crf', '23',
        '-c:a', 'copy',
        '-map_metadata', '-1'
      ])
      .save(outputPath)
      .on('end', resolve)
      .on('error', reject);
  });
}

async function processAndUploadVideo(inputPath) {
  const outputPath = inputPath.replace(/(\.\w+)$/, '_processed$1');
  await removeMetadataAndCompress(inputPath, outputPath);
  const url = await uploadToBackblaze(outputPath);

  fs.unlinkSync(inputPath);
  fs.unlinkSync(outputPath);

  return url;
}

module.exports = { processAndUploadVideo };

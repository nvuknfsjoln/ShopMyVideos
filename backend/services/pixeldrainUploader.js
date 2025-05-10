const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function uploadToPixeldrain(filePath) {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    const response = await axios.post('https://pixeldrain.com/api/file', form, {
        headers: form.getHeaders()
    });

    if (response.data.success) {
        return `https://pixeldrain.com/u/${response.data.id}`;
    } else {
        throw new Error('Upload failed');
    }
}

module.exports = { uploadToPixeldrain };

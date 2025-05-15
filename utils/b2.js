const fs = require('fs');
const B2 = require('backblaze-b2');

const b2 = new B2({
  applicationKeyId: process.env.B2_KEY_ID,
  applicationKey: process.env.B2_APPLICATION_KEY
});

let authorized = false;

async function ensureAuth() {
  if (!authorized) {
    await b2.authorize();
    authorized = true;
  }
}

async function uploadToBackblaze(filePath) {
  await ensureAuth();
  const bucket = await b2.getBucket({ bucketName: process.env.B2_BUCKET_NAME });
  const filename = `videos/${Date.now()}_${path.basename(filePath)}`;
  const data = fs.readFileSync(filePath);

  const uploadUrl = await b2.getUploadUrl({ bucketId: bucket.data.buckets[0].bucketId });

  const result = await b2.uploadFile({
    uploadUrl: uploadUrl.data.uploadUrl,
    uploadAuthToken: uploadUrl.data.authorizationToken,
    filename,
    data
  });

  return `https://f000.backblazeb2.com/file/${process.env.B2_BUCKET_NAME}/${filename}`;
}

module.exports = { uploadToBackblaze };

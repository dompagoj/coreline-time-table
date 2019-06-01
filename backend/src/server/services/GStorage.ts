import { Storage } from '@google-cloud/storage'
import { resolve } from 'app-root-path'
import { config } from '../config';

const gc = new Storage({
  keyFilename: resolve('google-cloud-storage.json'),
  projectId: 'coreline-time-table',
})

const bucket = gc.bucket('coreline-time-table')

function getPublicUrl (filename) {
  return `${config.bucketUrl}/${filename}`;
}

export async function uploadProfileImage(req, res, next) {
  if (!req.file) {
    return next();
  }

  const gcsname = `user-profile/${Date.now()}-${req.file.originalname}`
  const file = bucket.file(gcsname);

  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    },
    resumable: false
  });

  stream.on('error', (err) => {
    req.file.cloudStorageError = err;
    next(err);
  });

  stream.on('finish', () => {
    file.makePublic().then(() => {
      req.file.url = getPublicUrl(gcsname)
      next();
    });
  });

  stream.end(req.file.buffer);
}

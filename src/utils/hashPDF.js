import { PassThrough } from 'stream';
import objectPath from 'object-path';
import hashFile from './hashFile';
import writeToPDF from './writeToPDF';

export default function hashPDF(
  input,
  algorithm = 'sha256',
  root = 'content.hash'
) {
  return new Promise((resolve, reject) => {
    const proxy = new PassThrough();

    writeToPDF(input, proxy).catch(reject);

    hashFile(proxy, algorithm)
      .then(hash => {
        if (root) {
          const json = {};
          objectPath.set(json, root, hash);
          resolve(json);
          return;
        }
        resolve(hash);
      })
      .catch(reject);
  });
}

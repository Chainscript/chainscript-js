import path from 'path';
import Q from 'q';
import temp from 'temp';
import objectPath from 'object-path';
import hashFile from './hashFile';
import writeToPDF from './writeToPDF';

temp.track();

export default function hashPDF(
  src,
  algorithm = 'sha256',
  root = 'content.hash'
) {
  const deferred = Q.defer();

  temp.mkdir('hash_pdf', (err, dirPath) => {
    if (err) {
      deferred.reject(err);
      return;
    }

    const dest = path.join(dirPath, 'tmp.pdf');

    writeToPDF(src, dest)
      .then(() => hashFile(dest, algorithm))
      .then(hash => {
        if (root) {
          const json = {};
          objectPath.set(json, root, hash);
          deferred.resolve(json);
          return;
        }
        deferred.resolve(hash);
      })
      .fail(deferred.reject);
  });

  return deferred.promise;
}

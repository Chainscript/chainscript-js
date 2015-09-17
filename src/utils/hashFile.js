import fs from 'fs';
import crypto from 'crypto';
import Q from 'q';

export default function hashFile(cwd, file, algorithm) {
  const deferred = Q.defer();

  setImmediate(() => {
    const hash = crypto.createHash(algorithm);
    const stream = fs.createReadStream(file);

    stream.on('error', err => {
      deferred.reject(err);
    });

    stream.on('data', data => {
      hash.update(data);
    });

    stream.on('end', () => {
      deferred.resolve(hash.digest('hex'));
    });
  });

  return deferred.promise;
}

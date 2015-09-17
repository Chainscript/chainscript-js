import path from 'path';
import objectPath from 'object-path';
import Q from 'q';
import hashFile from './hashFile';

export default function verifyFiles(cwd, script, root) {
  const deferred = Q.defer();
  const top = root ? objectPath.get(script, root) : script;
  const hashes = Object.keys(top.files);

  const next = () => {
    if (hashes.length === 0) {
      deferred.resolve();
      return;
    }

    const hash = hashes.shift();
    const file = top.files[hash];

    hashFile(cwd, path.resolve(cwd, file), top.algorithm)
      .then(h => {
        if (hash !== h) {
          deferred.reject(new Error('Mismatch: ' + file));
        }
        next();
      })
      .catch(deferred.reject);
  };

  next();

  return deferred.promise;
}

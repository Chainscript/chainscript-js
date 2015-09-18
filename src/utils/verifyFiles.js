import path from 'path';
import objectPath from 'object-path';
import Q from 'q';
import hashFile from './hashFile';

export default function verifyFiles(cwd, script, root) {
  const deferred = Q.defer();
  const top = root ? objectPath.get(script, root) : script;
  const hashes = Object.keys(top.files);
  const errors = [];

  const next = () => {
    if (hashes.length === 0) {
      if (errors.length > 0) {
        deferred.reject(new Error(errors.map(err => err.message).join('\n')));
      } else {
        deferred.resolve();
      }
      return;
    }

    const hash = hashes.shift();
    const file = top.files[hash];

    hashFile(cwd, path.resolve(cwd, file), top.algorithm)
      .then(h => {
        if (hash !== h) {
          errors.push(new Error('Mismatch: ' + file));
        }
      })
      .catch(err => errors.push(err))
      .finally(next);
  };

  next();

  return deferred.promise;
}

import path from 'path';
import multihash from 'multihashes';
import invertHash from 'invert-hash';
import objectPath from 'object-path';
import Q from 'q';
import hashFile, { HASH_MAP } from './hashFile';

const INVERTED_HASH_MAP = invertHash(HASH_MAP);

export default function verifyFiles(cwd, json, root) {
  const deferred = Q.defer();
  const top = objectPath.get(json, root || '');
  const hashes = Object.keys(top);
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
    const file = top[hash];
    const algorithmName = multihash.decode(new Buffer(hash, 'hex')).name;
    const algorithm = INVERTED_HASH_MAP[algorithmName];

    if (typeof algorithm === 'undefined') {
      deferred.reject(new Error('Unsupported algorithm: ' + algorithmName));
      return;
    }

    hashFile(cwd, path.resolve(cwd, file), algorithm)
      .then(h => {
        if (hash !== h.toString('hex')) {
          errors.push(new Error('Mismatch: ' + file));
        }
      })
      .catch(err => errors.push(err))
      .finally(next);
  };

  next();

  return deferred.promise;
}

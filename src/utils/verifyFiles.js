import path from 'path';
import multihash from 'multihashes';
import bs58 from 'bs58';
import invertHash from 'invert-hash';
import objectPath from 'object-path';
import hashFile, { HASH_MAP } from './hashFile';

const INVERTED_HASH_MAP = invertHash(HASH_MAP);

export default function verifyFiles(cwd, json, root) {
  return new Promise((resolve, reject) => {
    const top = objectPath.get(json, root || '');
    const hashes = Object.keys(top);
    const errors = [];

    const next = () => {
      if (hashes.length === 0) {
        if (errors.length > 0) {
          reject(new Error(errors.map(err => err.message).join('\n')));
        } else {
          resolve();
        }

        return;
      }

      const hash = hashes.shift();
      const file = top[hash];
      const buf = new Buffer(bs58.decode(hash));
      const algorithmName = multihash.decode(buf).name;
      const algorithm = INVERTED_HASH_MAP[algorithmName];

      if (typeof algorithm === 'undefined') {
        reject(new Error('Unsupported algorithm: ' + algorithmName));
        return;
      }

      hashFile(path.resolve(cwd, file), algorithm)
        .then(h => {
          if (hash !== h) {
            errors.push(new Error('Mismatch: ' + file));
          }
        })
        .catch(err => errors.push(err))
        .then(next);
    };

    next();
  });
}

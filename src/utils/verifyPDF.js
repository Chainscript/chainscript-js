import multihash from 'multihashes';
import bs58 from 'bs58';
import invertHash from 'invert-hash';
import objectPath from 'object-path';
import Q from 'q';
import readFromPDF from './readFromPDF';
import hashPDF from './hashPDF';
import { HASH_MAP } from './hashFile';

const INVERTED_HASH_MAP = invertHash(HASH_MAP);

export default function verifyPDF(src, root = 'body.content.hash') {
  const deferred = Q.defer();
  let hash;
  let algorithm;

  readFromPDF(src)
    .then(json => {
      if (!json) {
        deferred.reject(new Error('Failed'));
        return null;
      }

      hash = objectPath.get(json, root);
      const buf = new Buffer(bs58.decode(hash));
      const algorithmName = multihash.decode(buf).name;
      algorithm = INVERTED_HASH_MAP[algorithmName];

      if (typeof algorithm === 'undefined') {
        deferred.reject(new Error('Unsupported algorithm: ' + algorithmName));
        return null;
      }

      return hashPDF(src, algorithm, null);
    })
    .then(h => {
      if (hash === h) {
        deferred.resolve();
      } else {
        deferred.reject(new Error('Failed'));
      }
    })
    .fail(deferred.reject);

  return deferred.promise;
}

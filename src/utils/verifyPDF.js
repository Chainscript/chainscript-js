import multihash from 'multihashes';
import bs58 from 'bs58';
import invertHash from 'invert-hash';
import objectPath from 'object-path';
import readFromPDF from './readFromPDF';
import hashPDF from './hashPDF';
import { HASH_MAP } from './hashFile';

const INVERTED_HASH_MAP = invertHash(HASH_MAP);

export default function verifyPDF(src, root = 'body.content.hash') {
  return new Promise((resolve, reject) => {
    let hash;
    let algorithm;

    readFromPDF(src)
      .then(json => {
        if (!json) {
          reject(new Error('Failed'));
          return null;
        }

        hash = objectPath.get(json, root);
        const buf = new Buffer(bs58.decode(hash));
        const algorithmName = multihash.decode(buf).name;
        algorithm = INVERTED_HASH_MAP[algorithmName];

        if (typeof algorithm === 'undefined') {
          reject(new Error('Unsupported algorithm: ' + algorithmName));
          return null;
        }

        return hashPDF(src, algorithm, null);
      })
      .then(h => {
        if (hash === h) {
          resolve();
        } else {
          reject(new Error('Failed'));
        }
      })
      .catch(reject);
  });
}

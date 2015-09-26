import multihash from 'multihashes';
import bs58 from 'bs58';
import invertHash from 'invert-hash';
import objectPath from 'object-path';
import readFromPDF from './readFromPDF';
import hashPDF from './hashPDF';
import { HASH_MAP } from './hashFile';

const INVERTED_HASH_MAP = invertHash(HASH_MAP);

export default function verifyPDF(src, root = 'body.content.hash', toJson) {
  let hash;
  let algorithm;

  return readFromPDF(src)
    .then(json => {
      if (!json) {
        throw new Error('Failed');
      }

      hash = objectPath.get(json, root);
      const buf = new Buffer(bs58.decode(hash));
      const algorithmName = multihash.decode(buf).name;
      algorithm = INVERTED_HASH_MAP[algorithmName];

      if (typeof algorithm === 'undefined') {
        throw new Error('Unsupported algorithm: ' + algorithmName);
      }

      return hashPDF(src, algorithm, null);
    })
    .then(h => {
      if (hash === h) {
        if (toJson) {
          return {verified: true, wants: hash, has: h};
        }

        return true;
      }

      if (toJson) {
        return {verified: false, wants: hash, has: h};
      }

      throw new Error('Failed');
    });
}

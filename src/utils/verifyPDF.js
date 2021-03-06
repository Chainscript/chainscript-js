import { PassThrough } from 'stream';
import multihash from 'multihashes';
import bs58 from 'bs58';
import invertHash from 'invert-hash';
import objectPath from 'object-path';
import readFromPDF from './readFromPDF';
import hashPDF from './hashPDF';
import { HASH_MAP } from './hashFile';

const INVERTED_HASH_MAP = invertHash(HASH_MAP);

export default function verifyPDF(input, root = 'body.content.hash', toJson) {
  let hash;
  let algorithm;
  let input1;
  let input2;

  if (typeof input === 'string') {
    input1 = input;
    input2 = input;
  } else {
    input1 = new PassThrough();
    input2 = new PassThrough();

    input.pipe(input1);
    input.pipe(input2);
  }

  return readFromPDF(input1)
    .then(json => {
      if (!json) {
        if (toJson) {
          return {verified: false, wants: null, has: null};
        }

        throw new Error('Failed');
      }

      hash = objectPath.get(json, root);
      const buf = new Buffer(bs58.decode(hash));
      const algorithmName = multihash.decode(buf).name;
      algorithm = INVERTED_HASH_MAP[algorithmName];

      if (typeof algorithm === 'undefined') {
        throw new Error('Unsupported algorithm: ' + algorithmName);
      }

      return hashPDF(input2, algorithm, null);
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

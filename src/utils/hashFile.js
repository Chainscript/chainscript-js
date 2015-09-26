import fs from 'fs';
import crypto from 'crypto';
import multihash from 'multihashes';
import bs58 from 'bs58';

export const HASH_MAP = {
  sha1: 'sha1',
  sha256: 'sha2-256',
  sha512: 'sha2-512'
};

export default function hashFile(input, algorithm) {
  return new Promise((resolve, reject) => {
    const algorithmName = HASH_MAP[algorithm];

    if (typeof algorithmName === 'undefined') {
      throw new Error('Unsupported algorithm: ' + algorithm);
    }

    const hash = crypto.createHash(algorithm);
    const reader = typeof input === 'string' ?
                   fs.createReadStream(input) :
                   input;

    reader.on('error', reject);

    reader.on('data', data => hash.update(data));

    reader.on('end', () => {
      const res = bs58.encode(multihash.encode(hash.digest(), algorithmName));
      resolve(res);
    });
  });
}

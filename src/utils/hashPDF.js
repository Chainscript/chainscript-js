import { PassThrough } from 'stream';
import Q from 'q';
import objectPath from 'object-path';
import hashFile from './hashFile';
import writeToPDF from './writeToPDF';

export default function hashPDF(
  input,
  algorithm = 'sha256',
  root = 'content.hash'
) {
  const deferred = Q.defer();
  const proxy = new PassThrough();

  writeToPDF(input, proxy).fail(deferred.reject);

  hashFile(proxy, algorithm)
    .then(hash => {
      if (root) {
        const json = {};
        objectPath.set(json, root, hash);
        deferred.resolve(json);
        return;
      }
      deferred.resolve(hash);
    })
    .fail(deferred.reject);

  return deferred.promise;
}

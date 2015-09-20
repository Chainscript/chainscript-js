import { exec } from 'child_process';
import path from 'path';
import Q from 'q';
import temp from 'temp';
import objectPath from 'object-path';
import writeToPDF from './writeToPDF';
import hashFile from './hashFile';

temp.track();

function dumpMetaData(src, dest) {
  const deferred = Q.defer();
  const cmd = 'pdftk ' + src + ' dump_data_utf8 output ' + dest;

  exec(cmd, err => {
    if (err) {
      deferred.reject(err);
      return;
    }

    deferred.resolve();
  });

  return deferred.promise;
}

function updateMetaData(src, dest, info) {
  const deferred = Q.defer();
  const cmd = 'pdftk ' + src +
              ' update_info_utf8 ' + info +
              ' output ' + dest;

  exec(cmd, err => {
    if (err) {
      deferred.reject(err);
      return;
    }

    deferred.resolve();
  });

  return deferred.promise;
}

export default function hashPDF(
  src,
  algorithm = 'sha256',
  root = 'content.hash'
) {
  const deferred = Q.defer();

  temp.mkdir('hash_pdf', (err1, dirPath) => {
    if (err1) {
      deferred.reject(err1);
      return;
    }

    const info = path.join(dirPath, 'metadata.info');
    const dest1 = path.join(dirPath, 'stage1.pdf');
    const dest2 = path.join(dirPath, 'stage2.pdf');

    dumpMetaData(src, info)
      .then(() => writeToPDF(src, dest1))
      .then(() => updateMetaData(src, dest2, info))
      .then(() => hashFile(dest2, algorithm))
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
  });

  return deferred.promise;
}

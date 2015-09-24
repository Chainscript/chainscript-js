import { readdir, stat } from 'fs';
import { join } from 'path';
import Q from 'q';

export default function walkDir(dir, filter, fileCb) {
  const deferred = Q.defer();

  readdir(dir, (err, fileList) => {
    if (err) {
      deferred.reject(err);
      return;
    }

    let files = fileList.map(f => join(dir, f));
    files = filter ? filter(files) : files;

    function next() {
      if (files.length < 1) {
        deferred.resolve();
        return;
      }

      const file = files.shift();

      if (!file) {
        next();
        return;
      }

      stat(file, (statErr, stats) => {
        if (statErr) {
          deferred.reject(statErr);
          return;
        }

        if (stats.isDirectory()) {
          walkDir(file, filter, fileCb).then(next).catch(deferred.reject);
        } else if (fileCb) {
          fileCb(file).then(next).catch(deferred.reject);
        } else {
          next();
        }
      });
    }

    next();
  });

  return deferred.promise;
}

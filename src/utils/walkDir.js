import { readdir, lstat } from 'fs';
import { join } from 'path';

export default function walkDir(dir, filter, fileCb) {
  return new Promise((resolve, reject) => {
    readdir(dir, (err, fileList) => {
      if (err) {
        reject(err);
        return;
      }

      let files = fileList.map(f => join(dir, f));
      files = filter ? filter(files) : files;

      function next() {
        if (files.length < 1) {
          resolve();
          return;
        }

        const file = files.shift();

        if (!file) {
          next();
          return;
        }

        lstat(file, (statErr, stats) => {
          if (statErr) {
            reject(statErr);
            return;
          }

          if (stats.isDirectory()) {
            walkDir(file, filter, fileCb).then(next).catch(reject);
          } else if (!stats.isSymbolicLink() && fileCb) {
            fileCb(file).then(next).catch(reject);
          } else {
            next();
          }
        });
      }

      next();
    });
  });
}

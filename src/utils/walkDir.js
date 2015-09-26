import fs from 'fs';
import { join } from 'path';
import promisify from './promisify';

const readdir = promisify(fs.readdir);
const lstat = promisify(fs.lstat);

export default function walkDir(dir, filter, fileCb) {
  return readdir(dir)
    .then(fileList => {
      let files = fileList.map(f => join(dir, f));
      files = filter ? filter(files) : files;

      const next = () => {
        if (files.length < 1) {
          return true;
        }

        const file = files.shift();

        if (!file) {
          return next();
        }

        return lstat(file)
          .then(stats => {
            if (stats.isDirectory()) {
              return walkDir(file, filter, fileCb).then(next);
            } else if (!stats.isSymbolicLink() && fileCb) {
              return fileCb(file).then(next);
            }

            return next();
          });
      };

      return next();
    });
}

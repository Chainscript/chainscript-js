import path from 'path';
import recursive from 'recursive-readdir';
import Q from 'q';
import objectPath from 'object-path';
import ignore from 'ignore';
import hashFile from './hashFile';

const ignorer = ignore().addIgnoreFile(
  ignore.select([
    '.csignore',
    '.gitignore'
  ])
);

function hashDir(cwd, dir, hashes) {
  const deferred = Q.defer();

  recursive(dir, (err, files) => {
    if (err) {
      deferred.reject(err);
      return;
    }

    const next = () => {
      if (files.length === 0) {
        deferred.resolve();
        return;
      }

      const file = files.shift();
      const relative = path.relative(cwd, file);

      if (ignorer.filter([relative]).length === 0) {
        next();
        return;
      }

      hashFile(cwd, file, hashes.algorithm)
        .then(hash => {
          hashes.files[hash] = relative;
          next();
        })
        .catch(deferred.reject);
    };

    next();
  });

  return deferred.promise;
}

export default function hashFiles(cwd, paths, algorithm = 'sha2-256', root = '') {
  const deferred = Q.defer();
  const hashes = {algorithm, files: {}};
  const dirs = [...paths];

  const originalCwd = process.cwd();
  process.chdir(cwd);

  const next = () => {
    if (dirs.length === 0) {
      let json;

      if (root) {
        json = {};
        objectPath.set(json, root || '', hashes);
      } else {
        json = hashes;
      }

      process.chdir(originalCwd);
      deferred.resolve(json);
      return;
    }

    const dir = dirs.shift();

    hashDir(cwd, dir, hashes)
      .then(next)
      .catch(() => {
        process.chdir(originalCwd);
        deferred.reject();
      });
  };

  next();

  return deferred.promise;
}

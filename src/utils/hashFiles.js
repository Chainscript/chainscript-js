import path from 'path';
import recursive from 'recursive-readdir';
import Q from 'q';
import objectPath from 'object-path';
import hashFile from './hashFile';

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

      hashFile(cwd, file, hashes.algorithm)
        .then(hash => {
          hashes.files[hash] = path.relative(cwd, file);
          next();
        })
        .catch(deferred.reject);
    };

    next();
  });

  return deferred.promise;
}

export default function hashFiles(cwd, paths, algorithm = 'md5', root = '') {
  const deferred = Q.defer();
  const hashes = {algorithm, files: {}};
  const dirs = [...paths];

  const next = () => {
    if (dirs.length === 0) {
      let json;

      if (root) {
        json = {};
        objectPath.set(json, root || '', hashes);
      } else {
        json = hashes;
      }

      deferred.resolve(json);
      return;
    }

    const dir = dirs.shift();

    hashDir(cwd, dir, hashes)
      .then(next)
      .catch(deferred.reject);
  };

  next();

  return deferred.promise;
}

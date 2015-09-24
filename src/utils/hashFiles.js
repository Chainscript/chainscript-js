import path from 'path';
import Q from 'q';
import objectPath from 'object-path';
import ignore from 'ignore';
import walkDir from './walkDir';
import hashFile from './hashFile';

const ignorer = ignore().addIgnoreFile(
  ignore.select([
    '.csignore',
    '.gitignore'
  ])
);

function hashDir(cwd, dir, algorithm, hashes) {
  return walkDir(dir, files =>
    ignorer.filter(files.map(f => path.relative(cwd, f)))
  , file =>
    hashFile(file, algorithm)
      .then(hash => hashes[hash] = path.relative(cwd, file))
  );
}

export default function hashFiles(cwd, paths, algorithm = 'sha256', root = '') {
  const deferred = Q.defer();
  const hashes = {};
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

    hashDir(cwd, dir, algorithm, hashes)
      .then(next)
      .catch(err => {
        process.chdir(originalCwd);
        deferred.reject(err);
      });
  };

  next();

  return deferred.promise;
}

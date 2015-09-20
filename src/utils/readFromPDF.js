import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import Q from 'q';
import temp from 'temp';

temp.track();

export default function readFromPDF(src, name = 'chainscript.json') {
  const deferred = Q.defer();

  temp.mkdir('read_from_pdf', (err1, dirPath) => {
    if (err1) {
      deferred.reject(err1);
      return;
    }

    const cmd = 'pdftk ' + src + ' unpack_files output ' + dirPath;

    exec(cmd, err2 => {
      if (err2) {
        deferred.reject(err2);
        return;
      }

      fs.readFile(path.join(dirPath, name), 'utf8', (err3, data) => {
        if (err3) {
          deferred.reject(err3);
          return;
        }

        try {
          deferred.resolve(JSON.parse(data));
        } catch (err4) {
          deferred.reject(err4);
        }
      });
    });
  });

  return deferred.promise;
}

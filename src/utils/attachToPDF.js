import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import Q from 'q';
import temp from 'temp';

temp.track();

export default function attachToPDF(
  src,
  dest,
  script,
  name = 'chainscript.json'
) {
  const deferred = Q.defer();

  temp.mkdir('attach_to_pdf', (err1, dirPath) => {
    if (err1) {
      deferred.reject(err1);
      return;
    }

    const attachmentPath = path.join(dirPath, name);
    const data = (script ? JSON.stringify(script, null, '\t') : '') + '\n';

    fs.writeFile(attachmentPath, data, 'utf8', err2 => {
      if (err2) {
        deferred.reject(err2);
        return;
      }

      const cmd = 'pdftk ' + src +
              ' attach_files ' + attachmentPath +
              ' output ' + dest;

      exec(cmd, err3 => {
        if (err3) {
          deferred.reject(err3);
          return;
        }

        deferred.resolve();
      });
    });

  });
  return deferred.promise;
}

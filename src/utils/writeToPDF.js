import fs from 'fs';
import Q from 'q';

export default function writeToPDF(src, dest, script) {
  const deferred = Q.defer();

  fs.readFile(src, (err, data) => {

    if (err) {
      deferred.reject(err);
      return;
    }

    let start = data.indexOf('\n% Chainscript: ');
    let end;

    if (start < 0) {
      let pos = 0;

      do {
        pos = data.indexOf('startxref', pos + 9);

        if (pos >= 0) {
          start = end = pos;
        }
      } while (pos >= 0)

      if (start < 0) {
        deferred.reject(new Error('Could not find startxref'));
        return;
      }
    } else {
      end = data.indexOf('\n', start + 16) + 1;
    }

    const writer = fs.createWriteStream(dest, {
      defaultEncoding: 'binary',
      mode: 0o644
    });

    writer.on('error', deferred.reject);
    writer.write(data.slice(0, start));

    if (script) {
      writer.write('\n% Chainscript: ' + JSON.stringify(script) + '\n');
    }

    writer.end(data.slice(end), deferred.resolve);
  });

  return deferred.promise;
}

import fs from 'fs';
import Q from 'q';

/**
 * This could be improved by not putting the entire PDF in a buffer.
 */
export default function writeToPDF(input, output, script) {

  const deferred = Q.defer();
  const reader = typeof input === 'string' ?
                 fs.createReadStream(input) :
                 input;

  let buffer = new Buffer([]);

  reader.on('error', deferred.reject);

  reader.on('data', data => buffer = Buffer.concat([buffer, data]));

  reader.on('end', () => {
    let start = buffer.indexOf('\n% Chainscript: ');
    let end;

    if (start < 0) {
      let pos = 0;

      do {
        pos = buffer.indexOf('startxref', pos + 9);

        if (pos >= 0) {
          start = end = pos;
        }
      } while (pos >= 0)

      if (start < 0) {
        deferred.reject(new Error('Could not find startxref'));
        return;
      }
    } else {
      end = buffer.indexOf('\n', start + 16) + 1;
    }

    const writer = typeof output === 'string' ?
                   fs.createWriteStream(output, {
                     defaultEncoding: 'binary',
                     mode: 0o644
                   }) :
                   output;

    writer.on('error', deferred.reject);
    writer.write(buffer.slice(0, start));

    if (script) {
      writer.write('\n% Chainscript: ' + JSON.stringify(script) + '\n');
    }

    writer.end(buffer.slice(end), deferred.resolve);
  });

  return deferred.promise;
}

import fs from 'fs';
import Q from 'q';

/**
 * We look for these to find meta data location
 */
const META_SEARCH = [
  '/ModDate',
  '/CreationDate',
  '/Creator',
  '/Title',
  '/Producer',
  '/Author'
];

const NEW_LINE_CODES = [
  '\n'.charCodeAt(),
  '\r'.charCodeAt()
];

function encodeScript(script) {
  return JSON.stringify(script)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

export default function writeToPDF(
  src,
  dest,
  script
) {
  const deferred = Q.defer();

  fs.readFile(src, (err, data) => {
    if (err) {
      deferred.reject(err);
      return;
    }

    let delta = 0;
    let buffer = data;
    let begin = buffer.indexOf('/Chainscript (');

    if (begin > -1) {
      let end = data.indexOf(')', begin);

      while (data[end - 1] === '\\'.charCodeAt()) {
        end = data.indexOf(')', end + 1);
      }

      end++;

      if (NEW_LINE_CODES.indexOf(data[end]) >= 0) {
        end++;
      }

      delta -= end - begin;
      buffer = Buffer.concat([buffer.slice(0, begin), buffer.slice(end)]);
    }

    if (script) {
      for (let i = 0; i < META_SEARCH.length; i++) {
        begin = buffer.indexOf(META_SEARCH[i]);

        if (begin >= 0) {
          break;
        }
      }

      if (begin < 0) {
        deferred.reject(new Error('Could not find metadata'));
        return;
      }

      begin = buffer.indexOf(')', begin) + 1;

      const newLine = NEW_LINE_CODES.reduce((prev, c) => {
        return buffer[begin] === c ? String.fromCharCode(c) : prev;
      }, '');

      if (newLine) {
        begin++;
      }

      const str = '/Chainscript (' + encodeScript(script) + ')' + newLine;

      buffer = Buffer.concat([
        buffer.slice(0, begin),
        new Buffer(str),
        buffer.slice(begin)
      ]);

      delta += str.length;
    }

    begin = buffer.indexOf('\nstartxref\n');

    if (begin < 0) {
      begin = buffer.indexOf('\rstartxref\r');
    }

    if (begin < 0) {
      deferred.reject(new Error('Could not find startxref'));
      return;
    }

    begin += 11;

    let end = buffer.indexOf('\n', begin);

    if (end < 0) {
      end = buffer.indexOf('\r', begin);
    }

    const start = parseInt(buffer.slice(begin, end).toString(), 10) + delta;

    buffer = Buffer.concat([
      buffer.slice(0, begin),
      new Buffer(start.toFixed()),
      buffer.slice(end)
    ]);

    fs.writeFile(dest, buffer, writeErr => {
      if (writeErr) {
        deferred.reject(writeErr);
        return;
      }

      deferred.resolve();
    });
  });

  return deferred.promise;
}

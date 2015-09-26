import fs from 'fs';
import promisify from './promisify';

const readFile = promisify(fs.readFile);

export default function readFromPDF(src) {
  return readFile(src)
    .then(data => {
      let start = data.indexOf('\n% Chainscript: ');

      if (start < 0) {
        return null;
      }

      start += 16;
      const end = data.indexOf('\n', start);
      const str = data.slice(start, end).toString();

      try {
        return JSON.parse(str);
      } catch (err) {
        return err;
      }
    });
}

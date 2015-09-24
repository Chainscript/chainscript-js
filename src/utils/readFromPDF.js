import fs from 'fs';

export default function readFromPDF(src) {
  return new Promise((resolve, reject) => {
    fs.readFile(src, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      let start = data.indexOf('\n% Chainscript: ');

      if (start < 0) {
        resolve(null);
        return;
      }

      start += 16;
      const end = data.indexOf('\n', start);
      const str = data.slice(start, end).toString();

      try {
        resolve(JSON.parse(str));
      } catch (jsonErr) {
        reject(jsonErr);
      }
    });
  });
}

import fs from 'fs';

export default function readFromPDF(input) {
  return new Promise((resolve, reject) => {
    const reader = typeof input === 'string' ?
                   fs.createReadStream(input) :
                   input;

    let buffer = new Buffer([]);

    reader.on('error', reject);

    reader.on('data', data => buffer = Buffer.concat([buffer, data]));

    reader.on('end', () => {
      let start = buffer.indexOf('\n% Chainscript: ');

      if (start < 0) {
        resolve(null);
      }

      start += 16;
      const end = buffer.indexOf('\n', start);
      const str = buffer.slice(start, end).toString();

      try {
        resolve(JSON.parse(str));
      } catch (err) {
        reject(err);
      }
    });
  });
}

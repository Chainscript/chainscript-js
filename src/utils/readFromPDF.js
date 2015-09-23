import fs from 'fs';
import Q from 'q';

export default function readFromPDF(src) {
  const deferred = Q.defer();

  fs.readFile(src, (err, data) => {

    if (err) {
      deferred.reject(err);
      return;
    }

    let start = data.indexOf('\n% Chainscript: ');

    if (start < 0) {
      deferred.resolve(null);
      return;
    }

    start += 16;
    const end = data.indexOf('\n', start);
    const str = data.slice(start, end).toString();

    try {
      deferred.resolve(JSON.parse(str));
    } catch (jsonErr) {
      deferred.reject(jsonErr);
    }
  });

  return deferred.promise;
}

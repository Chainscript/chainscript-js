import fs from 'fs';
import Q from 'q';

function decodeScript(data) {
  return JSON.parse(
    data
      .replace(/\\\(/g, '(')
      .replace(/\\\)/g, ')')
      .replace(/\\\\/g, '\\')
    );
}

export default function readFromPDF(src) {
  const deferred = Q.defer();

  fs.readFile(src, (err, data) => {
    if (err) {
      deferred.reject(err);
      return;
    }

    const begin = data.indexOf('/Chainscript (');

    if (begin < 0) {
      deferred.resolve(null);
      return;
    }

    let end = data.indexOf(')', begin);

    while (data[end - 1] === '\\') {
      end = data.indexOf(')', end + 1);
    }

    const str = data.slice(begin + 14, end).toString();

    try {
      const script = decodeScript(str);
      deferred.resolve(script);
    } catch (jsonErr) {
      deferred.reject(jsonErr);
    }
  });

  return deferred.promise;
}

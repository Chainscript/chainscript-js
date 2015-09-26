export default function promisify(func) {
  return (...args1) => new Promise((resolve, reject) => {
    func(...args1, (err, ...args2) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(...args2);
    });
  });
}

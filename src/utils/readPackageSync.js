import { readFileSync } from 'fs';
import { resolve } from 'path';
import objectPath from 'object-path';

export default function readPackageSync(prop = null) {
  const path = resolve(__dirname, '../../package.json');
  const json = JSON.parse(readFileSync(path, 'utf8'));

  if (prop) {
    return objectPath.get(json, prop);
  }

  return json;
}

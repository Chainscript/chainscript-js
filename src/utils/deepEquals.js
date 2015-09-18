import { digest } from 'json-hash';

export default function deepEquals(a, b) {
  if (a === b) {
    return true;
  }

  return digest(a) === digest(b);
}

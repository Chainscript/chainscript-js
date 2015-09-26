import { digest } from 'json-hash';

export default function deepEquals(a, b) {
  return a === b || digest(a) === digest(b);
}

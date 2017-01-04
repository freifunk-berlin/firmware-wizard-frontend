import { module } from 'angular';

export default module('app.filters.range', [])
  .filter('range', () => (input, a, b) => {
    const res = [];
    let i;
    if (a < b) {
      for (i = a; i < b + 1; i += 1) {
        res.push(i);
      }
    } else {
      for (i = a; i > b - 1; i -= 1) {
        res.push(i);
      }
    }

    return res;
  });

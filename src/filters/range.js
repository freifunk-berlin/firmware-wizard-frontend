import { module } from 'angular';

export default module('app.filters.range', [])
  .filter('range', () => {
    return function(input, a, b) {
      var res = [];
      var i;
      if (a < b) {
        for (i = a; i < b + 1; i++) {
          res.push(i);
        }
      } else {
        for (i = a; i > b - 1; i--) {
          res.push(i);
        }
      }

      return res;
    };
  });

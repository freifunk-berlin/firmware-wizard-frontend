'use strict';

module.exports = function(app) {
  app.filter('range', function() {
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
};

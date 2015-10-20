'use strict';

module.exports = function(app) {

  // see http://stackoverflow.com/a/25299523/1219479
  app.filter('objectLength', function() {
    return function(input) {
      if (!angular.isObject(input)) {
        return;
      }
      return Object.keys(input).length;
    };
  });
};

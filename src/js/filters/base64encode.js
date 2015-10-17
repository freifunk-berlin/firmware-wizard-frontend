'use strict';

module.exports = function(app) {
  app.filter('base64encode', ['$window', function($window) {
    return function(input) {
      return $window.btoa(input);
    };
  }]);
};

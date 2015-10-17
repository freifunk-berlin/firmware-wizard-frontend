'use strict';

var ip = require('ip');

module.exports = function(app) {
  // check if the provided value is a valid ipv4 address
  app.directive('ipv4Address', function() {
    return {
      require: 'ngModel',
      link: function(scope, element, attributes, ngModel) {
        ngModel.$validators.ipv4Address = function(modelValue) {
          //validation for required should be done via ng-required directive
          //or the validation even fails if the field is not required
          if (typeof modelValue == 'undefined' || modelValue === '') {
            return true;
          }

          // we run an additional regular expression against the model
          // because the 'ip' module does not catch all cases
          var ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
          if (!ipRegex.exec(modelValue)) {
            return false;
          }

          // parse ip with 'ip' module
          var parsedIp;
          try {
            parsedIp = ip.subnet(modelValue, '255.255.255.255');
          } catch (e) {
            return false;
          }
          return true;
        };

      }
    };
  });
};

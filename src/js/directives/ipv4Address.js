'use strict';

var ip = require('ip');

module.exports = function(app) {
  // check if the provided value is a valid ipv4 address
  app.directive('ipAddress', function() {
    return {
      require: 'ngModel',
      link: function(scope, element, attributes, ngModel) {

        var ipv4Pattern = '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}' +
          '(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';
        var ipv4SubnetPattern = ipv4Pattern + '\/(25|26|27|28)';

        // there are a lot of regex for ipv6
        // http://regexlib.com/Search.aspx?k=ipv6
        // this one matches the expanded ipv6 pattern
        var ipv6Pattern = '([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}';
        var ipv6SubnetPattern = ipv6Pattern + '\/(64|65)';

        var ipv4AddressValidator = function(modelValue) {
          //validation for required should be done via ng-required directive
          //or the validation even fails if the field is not required
          if (isEmpty(modelValue)) {
            return true;
          }

          // we run an additional regular expression against the model
          // because the 'ip' module does not catch all cases
          if (!regexMatches(ipv4Pattern, modelValue)) {
            console.log('ipv4 pattern does not match');
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

        var ipv4SubnetValidator = function(modelValue) {
          //validation for required should be done via ng-required directive
          //or the validation even fails if the field is not required
          if (isEmpty(modelValue)) {
            return true;
          }
          return regexMatches(ipv4SubnetPattern, modelValue);
        };

        var ipv6AddressValidator = function(modelValue) {
          if (isEmpty(modelValue)) {
            return true;
          }
          modelValue = expandV6Address(modelValue);
          return regexMatches(ipv6Pattern, modelValue);
        };

        var ipv6SubnetValidator = function(modelValue) {
          if (isEmpty(modelValue)) {
            return true;
          }

          var splitted = modelValue.split('/');
          modelValue = expandV6Address(splitted[0]) + '/' + splitted[1];
          var valid = regexMatches(ipv6SubnetPattern, modelValue);
          return valid;
        };

        //expands an ipv6 address
        var expandV6Address = function(modelValue) {
          var collapsedV6 = modelValue.split(':');
          modelValue = '';
          for (var i = 0; i < collapsedV6.length; i++) {
            if (isEmpty(collapsedV6[i]) && isEmpty(collapsedV6[i + 1])) {
              //if there are two empty array items in a row
              //it means the pattern :: has to be replaced with :0
              for (var j = 8; j > collapsedV6.length - 2; j--) {
                modelValue = modelValue + ':0';
              }
              //skip next entry
              i++;
            } else {
              modelValue = modelValue + ':' + collapsedV6[i];
            }
          }
          return modelValue.substr(1);
        };

        var regexMatches = function(pattern, modelValue) {
          var ipRegex = new RegExp('^' + pattern + '$');
          if (ipRegex.exec(modelValue)) {
            return true;
          }
          return false;
        };

        var isEmpty = function(modelValue) {
          if (typeof modelValue == 'undefined' || modelValue === '') {
            return true;
          }
          return false;
        };

        //add validators
        if (typeof attributes.ipVersion == 'undefined' ||
            attributes.ipVersion == '4') {
          if (typeof attributes.ipType == 'undefined') {
            ngModel.$validators.ipv4Address = ipv4AddressValidator;
          } else if (attributes.ipType == 'subnet') {
            ngModel.$validators.ipv4Subnet = ipv4SubnetValidator;
          } else {
            if (console) {
              console.error('ip type >' + attributes.ipType +
                  '< is not supported');
            }
          }
        } else if (attributes.ipVersion == '6') {
          if (typeof attributes.ipType == 'undefined') {
            ngModel.$validators.ipv6Address = ipv6AddressValidator;
          } else if (attributes.ipType == 'subnet') {
            ngModel.$validators.ipv6Subnet = ipv6SubnetValidator;
          } else {
            if (console) {
              console.error('ip type >' + attributes.ipType +
                  '< is not supported');
            }
          }
        } else {
          if (console) {
            console.error('ip version >' + attributes.ipVersion +
                '< is not supported');
          }
        }
      }
    };
  });
};

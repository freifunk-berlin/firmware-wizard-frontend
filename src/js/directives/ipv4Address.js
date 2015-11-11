'use strict';

var ip = require('ip-address');

module.exports = function(app) {
  // check if the provided value is a valid ipv4 or ipv6 address
  //
  // Usage example:
  // <input type="text" ng-model="v6Prefix"
  //   ip-address ip-version="6"
  //   ip-prefix-min-length="48"
  //   ip-prefix-max-length="62">
  app.directive('ipAddress', function() {
    return {
      require: 'ngModel',
      link: function(scope, element, attributes, ngModel) {

        var ipAddress = attributes.ipVersion === '4' ? ip.Address4 : ip.Address6;

        ngModel.$validators.ipAddress = function(modelValue) {
          var parsedIp = new ipAddress(modelValue || '');
          return parsedIp.valid;
        }

        if (attributes.ipPrefixMinLength !== undefined) {
          var minLength = parseInt(attributes.ipPrefixMinLength);
          ngModel.$validators.ipPrefixMinLength = function(modelValue) {
            var parsedIp = new ipAddress(modelValue || '');
            return parsedIp.valid && parsedIp.subnetMask >= minLength;
          }
        }

        ngModel.$validators.ipPrefixMaxLength = function(modelValue) {
          var maxLength = parseInt(attributes.ipPrefixMaxLength);
          ngModel.$validators.ipPrefixMaxLength = function(modelValue) {
            var parsedIp = new ipAddress(modelValue || '');
            return parsedIp.valid && parsedIp.subnetMask <= maxLength;
          }
        }
      }
    };
  });
};

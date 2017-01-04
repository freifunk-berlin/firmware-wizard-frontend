import { module } from 'angular';
import ip from 'ip-address';

export default module('app.directives.ip-address', [])
  .directive('ipAddress', () => ({
    // check if the provided value is a valid ipv4 or ipv6 address
    //
    // Usage example:
    // <input type="text" ng-model="v6Prefix"
    //   ip-address ip-version="6"
    //   ip-prefix-min-length="48"
    //   ip-prefix-max-length="62">
    require: 'ngModel',
    link: (scope, element, attributes, ngModel) => {
      const IpAddress = attributes.ipVersion === '4' ?
        ip.Address4 : ip.Address6;

      ngModel.$validators.ipAddress = (modelValue) => {
        if (modelValue === undefined) {
          return true;
        }
        const parsedIp = new IpAddress(modelValue || '');
        return parsedIp.valid;
      };

      if (attributes.ipPrefixMinLength !== undefined) {
        const minLength = parseInt(attributes.ipPrefixMinLength, 10);
        ngModel.$validators.ipPrefixMinLength = (modelValue) => {
          if (modelValue === undefined) {
            return true;
          }
          const parsedIp = new IpAddress(modelValue || '');
          return parsedIp.valid && parsedIp.subnetMask >= minLength;
        };
      }

      if (attributes.ipPrefixMaxLength !== undefined) {
        const maxLength = parseInt(attributes.ipPrefixMaxLength, 10);
        ngModel.$validators.ipPrefixMaxLength = (modelValue) => {
          if (modelValue === undefined) {
            return true;
          }
          const parsedIp = new IpAddress(modelValue || '');
          return parsedIp.valid && parsedIp.subnetMask <= maxLength;
        };
      }
    },
  }));

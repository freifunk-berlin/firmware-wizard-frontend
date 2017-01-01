import { module } from 'angular';

export default module('app.filters.object-length', [])
  .filter('objectLength', () => {
    // see http://stackoverflow.com/a/25299523/1219479
    return function(input) {
      if (!angular.isObject(input)) {
        return;
      }
      return Object.keys(input).length;
    };
  });

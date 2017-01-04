import { isObject, module } from 'angular';

export default module('app.filters.object-length', [])
  .filter('objectLength', () => (input) => {
    // see http://stackoverflow.com/a/25299523/1219479
    if (!isObject(input)) {
      return undefined;
    }
    return Object.keys(input).length;
  });

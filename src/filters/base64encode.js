import { module } from 'angular';

export default module('app.filters.base64encode', [])
  .filter('base64encode', $window => {
    'ngInject';
    return function(input) {
      return $window.btoa(input);
    };
  });

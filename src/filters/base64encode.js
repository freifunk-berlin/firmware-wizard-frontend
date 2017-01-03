import { module } from 'angular';

export default module('app.filters.base64encode', [])
  .filter('base64encode', $window => {
    'ngInject';

    // for unicode
    // see https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/btoa
    return function utoa(input) {
      return $window.btoa(unescape(encodeURIComponent(input)));
    };
  });

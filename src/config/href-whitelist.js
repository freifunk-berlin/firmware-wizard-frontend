import { module } from 'angular';

export default module('app.config.href-whitelist', [])
  .config($compileProvider => {
    'ngInject';
    // allow data: hrefs
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|mailto|data):/);
  });

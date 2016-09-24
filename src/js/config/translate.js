'use strict';

module.exports = function(app) {
  app.config(['$translateProvider', function($translateProvider) {
    $translateProvider.fallbackLanguage('en');
    $translateProvider.useStaticFilesLoader({
      prefix: 'nls/locale-',
      suffix: '.json'
    });

    $translateProvider.registerAvailableLanguageKeys([
      'en',
      //'de'
    ],{
      // 'de_*': 'de',
      'en_*': 'en',
      '*': 'en'
    });
    $translateProvider.determinePreferredLanguage();

    // sanitize translations with $sanitize
    $translateProvider.useSanitizeValueStrategy('sanitize');
  }]);
};

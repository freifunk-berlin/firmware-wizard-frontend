'use strict';

module.exports = function(app) {
  app.config(function($translateProvider) {
    $translateProvider.fallbackLanguage('en');
    $translateProvider.useStaticFilesLoader({
      prefix: 'nls/locale-',
      suffix: '.json'
    });

    /*
      TODO: re-enable 'de' (and possibly others) when texts are a bit more
            stable.
    */
    $translateProvider.registerAvailableLanguageKeys([
      'en',
      //'de'
    ],{
      //'de_*': 'de',
      'en_*': 'en',
      '*': 'en'
    });
    $translateProvider.determinePreferredLanguage();

    // sanitize translations with $sanitize
    $translateProvider.useSanitizeValueStrategy('sanitize');
  });
};

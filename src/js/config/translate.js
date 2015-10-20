'use strict';

module.exports = function(app) {
  app.config(function($translateProvider) {
    $translateProvider.fallbackLanguage(['en', 'de']);
    $translateProvider.useStaticFilesLoader({
      prefix: 'nls/locale-',
      suffix: '.json'
    });
    $translateProvider.registerAvailableLanguageKeys(['en', 'de'],
      {
        'de_*': 'de',
        'en_*': 'en',
        '*': 'en'
      }
    );
    $translateProvider.determinePreferredLanguage();
  });
};

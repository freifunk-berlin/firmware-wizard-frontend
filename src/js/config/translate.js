'use strict';

module.exports = function(app) {
  app.config(function($translateProvider) {
    $translateProvider.useStaticFilesLoader({
      prefix: 'nls/locale-',
      suffix: '.json'
    });
    $translateProvider.determinePreferredLanguage();
    $translateProvider.registerAvailableLanguageKeys(['en', 'de'],
      {
        'de_*': 'de',
        'en_*': 'en',
        '*': 'en'
      }
    );
  });
};

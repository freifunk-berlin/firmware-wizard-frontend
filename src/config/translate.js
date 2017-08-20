import { module } from 'angular';

export default module('app.config.translate', [])
  .config(($translateProvider) => {
    'ngInject';

    $translateProvider.fallbackLanguage('en');
    $translateProvider.useStaticFilesLoader({
      prefix: 'nls/locale-',
      suffix: '.json',
    });

    $translateProvider.registerAvailableLanguageKeys([
      'en',
      'de',
    ], {
      'de_*': 'de',
      'en_*': 'en',
      '*': 'en',
    });
    $translateProvider.determinePreferredLanguage();

    // sanitize translations with $sanitize
    $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
  });

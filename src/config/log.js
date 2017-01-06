import { module } from 'angular';

export default module('app.config.log', [])
  .config(($logProvider) => {
    'ngInject';

    // disable debug logging
    $logProvider.debugEnabled(false);
  });

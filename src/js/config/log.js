'use strict';

module.exports = function(app) {
  // disable debug logging
  app.config(['$logProvider', function($logProvider) {
    $logProvider.debugEnabled(false);
  }]);
};

'use strict';

module.exports = function(app) {
  // allow data: hrefs
  app.config(['$compileProvider', function($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|mailto|data):/);
  }]);
};

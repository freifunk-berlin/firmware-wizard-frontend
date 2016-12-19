/**
 * Created by andi on 18.12.16.
 */
'use strict';

module.exports = function(app) {
  app.controller('StatusCtrl', [
    '$scope', 'routerInformation', '$translate', '$location',
    function($scope, routerInformation, $translate, $location) {
      $scope.status = {
        url: $location.protocol() +
        '://' + $location.host() +
        '/ubus',
        olsr: {}
      };
      $scope.selectedLanguage = $translate.proposedLanguage() ||
        $translate.use();
      $scope.$watch('selectedLanguage', function(language) {
        $translate.use(language);
      }, true);

      $scope.refreshLinks = function(url) {
        routerInformation.queryOlsrLinks(url)
          .then(function(result) {
            $scope.status.olsr = result;
          });
      };

      $scope.refreshLinks($scope.status.url);

    }
  ]);
};

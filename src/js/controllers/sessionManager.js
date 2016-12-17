/**
 * Created by andi on 18.11.16.
 */
'use strict';

module.exports = function(app) {
  app.controller('SessionManagerCtrl', [
    '$scope', '$location', 'sessionManager',
    function($scope, $location, sessionManager) {
      $scope.auth = {};
      $scope.auth.url = $location.protocol() +
        '://' + $location.host() +
        '/ubus';
      $scope.authenticate = function() {
        sessionManager.authenticate($scope.auth.url,
          'root',
          $scope.auth.currentPassword);
        $scope.authModalInstance.close($scope);
      };

      $scope.cancel = function() {
        $scope.authModalInstance.dismiss('cancel');
      };
    }
  ]);
};

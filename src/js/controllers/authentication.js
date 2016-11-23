/**
 * Created by andi on 18.11.16.
 */
'use strict';

module.exports = function(app) {
  app.controller('AuthenticationCtrl', [
    '$scope', '$location', 'authentication',
    function($scope, $location, authentication) {
      $scope.auth = {};
      $scope.auth.url = $location.protocol() +
        '://' + $location.host() +
        '/ubus';
      $scope.authenticate = function() {
        authentication.authenticate($scope.auth.url,
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

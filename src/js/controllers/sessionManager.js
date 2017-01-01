/**
 * Created by andi on 18.11.16.
 */
'use strict';

module.exports = function(app) {
  app.controller('SessionManagerCtrl', [
    '$scope', '$location', 'session',
    function($scope, $location, session) {
      $scope.auth = {};
      $scope.auth.url = $location.protocol() +
        '://' + $location.host() +
        '/ubus';
      $scope.authenticate = function() {
        session.authenticate($scope.auth.url,
          'root',
          $scope.auth.currentPassword)
          .then(function(result) {
            $scope.authModalInstance.close($scope);
          });
      };

      $scope.cancel = function() {
        $scope.authModalInstance.dismiss('cancel');
      };
    }
  ]);
};

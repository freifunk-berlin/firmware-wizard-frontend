/**
 * Created by andi on 18.11.16.
 */
'use strict';

module.exports = function(app) {
  app.controller('AuthenticationCtrl', [
    '$scope',
    function($scope) {
      $scope.ok = function() {
        $scope.modalInstance.close($scope);
      };

      $scope.cancel = function() {
        $scope.modalInstance.dismiss('cancel');
      };
    }
  ]);
};
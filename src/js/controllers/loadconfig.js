'use strict';

module.exports = function(app) {
  app.controller('LoadConfigInstanceCtrl', [
    '$scope', 'Upload',
    function($scope, Upload) {

      $scope.ok = function() {
        $scope.modalInstance.close($scope);
      };

      $scope.cancel = function() {
        $scope.modalInstance.dismiss('cancel');
      };

      $scope.files = undefined;

      $scope.upload = function(files) {
        if (!files) {
          return;
        }
        var reader = new FileReader();
        reader.onload = function() {
          var myWizard = JSON.parse(reader.result);
          $scope.wizard = myWizard;
          if ($scope.wizard.router.sshkeys) {
            $scope.state.sshkeys.enabled = true;
          } else {
            $scope.state.sshkeys.enabled = false;
          }
          $scope.modalInstance.close($scope);
        };
        if (files && files.length) {
          for (var i = 0; i < files.length; i++) {
            var file = files[i];
            if (!file.$error) {
              reader.readAsText(file);

            }
          }
        }
      };

    }
  ]);
};

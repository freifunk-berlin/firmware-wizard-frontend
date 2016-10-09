'use strict';

module.exports = function(app) {
    app.controller('LoadConfigInstanceCtrl', [
        '$scope', 'Upload', '$uibModal',
        function(parent, $scope, Upload, $uibModalInstance) {

        console.log($scope);
        $scope.ok = function () {
            $uibModalInstance.close('');
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
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
                }
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
}

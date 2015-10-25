'use strict';

module.exports = function(app) {
  app.controller('DialogController',
    function($scope, $modalInstance, state, wizard, $interval, $http, $translate, downloadFile, $filter, REGISTER_IPS) {
      $scope.state = state;
      $scope.wizard = wizard;
      $scope.state.registerips = {
        progress: {
          reserved: 'notStarted',
          keyEntered: 'notStarted',
          confirmed: 'notStarted',
          configWritten: 'notStarted'
        },
        steps: 0,
      };
      $scope.state.generatevpn = {
        max: 4,
        progress: 0
      };

      $scope.getObjectKeys = function(scopeObject) {
        return Object.keys(scopeObject);
      }

      $scope.reserveIPs = function() {
        var meshIpsSubnetSize = Object.keys(state.wifi.devices).length;
        if (wizard.ip.meshLan) {
          meshIpsSubnetSize++
        }
        $http.post(REGISTER_IPS.service+REGISTER_IPS.reserve, {
          email: wizard.contact.email,
          routerName: wizard.router.name,
          v4subnet: [meshIpsSubnetSize, state.ip.v4ClientSubnetSize],
          v6subnet: [56]
        }).then(function(response) {
          //success callback
          $scope.state.registerips.progress.reserved = 'success';
          $scope.state.registerips.steps++;
        }, function(response){
          //error callback
          console.log(response);
          $scope.state.registerips.progress.reserved = 'error';
        });
      };

      //check confirmation code
      $scope.confirmIPs = function() {
        $scope.state.registerips.steps++;
        $scope.state.registerips.progress.keyEntered = 'success'
        $http.get(REGISTER_IPS.service+REGISTER_IPS.confirm).then(
          function(response) {
            //succuess callback
            $scope.state.registerips.steps++;
            $scope.state.registerips.progress.confirmed = 'success'
            //TODO write ips to wizard config
          }, function(response) {
            //error callback
            $scope.state.registerips.progress.confirmed = 'error'
          }
        );
      }

      $scope.generateVPN03CertAndKey = function() {
        /*
         * since this is not handled on the client we need a service on the router
         * that perfomrs the following tasks and reports a status
         *
         * ask vpn server to generate cert and key
         * download file
         * untar file and copy cert and key to correct location
         * write file location to config file
         */

        //just some testcode
        $interval(function() {
          if ($scope.state.generatevpn.progress <
              $scope.state.generatevpn.max) {
            $scope.state.generatevpn.progress++;
          }
        },1200,$scope.state.registerips.max);

        // show download cert and key tar file button or but everything in the "Download Config"?
      };

			$scope.downloadConfig = function() {
        downloadFile(
          'config.json',
          $filter('json')($scope.wizard),
          'application/json',
          true
        );
      };

      //return wizard and state back to parent controller
      $scope.ok = function() {
        $modalInstance.close({
          "wizard": $scope.wizard,
          "state": $scope.state
        });
      };

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };

      //show ip registration processing
      if ($scope.state.ip.register) {
        $scope.reserveIPs();
      }

      //show vpn files generation process
      if ($scope.wizard.internet.share &&
          $scope.state.internet.vpn03.generate) {
        $scope.generateVPN03CertAndKey();
      }
    }
  );
};

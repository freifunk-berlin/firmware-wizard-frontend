'use strict';

module.exports = function(app) {
  app.controller('DialogController',
    function($scope, $modalInstance, state, wizard, $interval, $http) {

      console.log(state);

      $scope.state = state;
      $scope.wizard = wizard;
      $scope.state.registerips = {
        max: 4,
        progress: 0
      };
      $scope.state.generatevpn = {
        max: 4,
        progress: 0
      };

      $scope.reserveIPs = function() {
        //call register ips
        $http.get('/nls/locale-de.json').then(function(response) {
          //success callback
          //TODO handle error in response
          //render confirmation code field
          $scope.state.registerips.reserved = true;
          $scope.state.registerips.message = {
            type:'info',
            value: 'success.reserveip'
          }
          $scope.state.registerips.progress++;
        }, function(response){
          //error callback
          console.log(response);
          $scope.state.registerips.message = {
            type:'error',
            value: 'error.reserveip'
          }
        });

        //just some testcode
        /*$interval(function() {
          if ($scope.state.registerips.progress <
              $scope.state.registerips.max) {
            $scope.state.registerips.progress++;
          }
        },3500,$scope.state.registerips.max);*/
      };

      //check confirmation code
      $scope.confirmIPs = function() {
        $scope.state.registerips.progress++;
        $http.get('gibs/nich.html').then(
          function(response) {
            //succuess callback

            //TODO check for error in response

            $scope.state.registerips.progress++;

            $scope.state.registerips.message = {
              type:'success',
              value: 'success.reserveip'
            }
            //write ips to wizard config
          }, function(response) {
            //error callback
            console.log(response);
            $scope.state.registerips.message = {
              type:'error',
              value: 'error.confirmip'
            }
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

      $scope.ok = function() {
        $modalInstance.close($scope.selected.item);
      };

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };

      if ($scope.state.ip.register) {
        $scope.reserveIPs();
      }

      if ($scope.wizard.internet.share &&
          $scope.state.internet.vpn03.generate) {
        $scope.generateVPN03CertAndKey();
      }
    }
  );
};

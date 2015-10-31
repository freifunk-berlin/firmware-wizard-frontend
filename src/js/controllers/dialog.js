'use strict';

var ip = require('ip');

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
        meshIPSubnet: function() {
          var meshIpsSubnetSize = Object.keys(state.wifi.devices).length;
          if (wizard.ip.meshLan) {
            meshIpsSubnetSize++
          }

          if (meshIpsSubnetSize < 3) {
            return 30;
          } else {
            return 29;
          }
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
        var data = {
          email: wizard.contact.email,
          routerName: wizard.router.name,
          v4subnet: [state.registerips.meshIPSubnet(), state.ip.v4ClientSubnetSize],
          v6subnet: [56]
        }
        console.log(data),
        $http({
          method: REGISTER_IPS.method,
          url: REGISTER_IPS.service+REGISTER_IPS.reserve
        }, data).then(function(response) {
          //success callback
          //TODO handle error in response
          $scope.state.registerips.progress.reserved = 'success';
          $scope.state.registerips.steps++;
        }, function(response){
          //error callback
          console.log('error');
          console.log(response);
          $scope.state.registerips.progress.reserved = 'error';
        });
      };

      //check confirmation code
      $scope.confirmIPs = function() {
        $scope.state.registerips.steps++;
        $scope.state.registerips.progress.keyEntered = 'success'
        $http({
          method: REGISTER_IPS.method,
          url: REGISTER_IPS.service+REGISTER_IPS.confirm
        }).then(
          function(response) {
            //succuess callback
            //TODO handle error in response message and wrecked data
            $scope.state.registerips.steps++;
            $scope.state.registerips.progress.confirmed = 'success';

            //assumption: ip registration service only sends back two v4 subnets
            //because we only ask for two of them
            //one for clients and one for meshing, but there is not hint wich is which
            var firstsubnet = ip.cidrSubnet(response.data.v4prefixes[0]);
            if (firstsubnet.subnetMaskLength == state.ip.v4ClientSubnetSize) {
              $scope.wizard.ip.v4ClientSubnet = response.data.v4prefixes[0];
              $scope.setMeshIps(response.data.v4prefixes[1]);
            } else {
              $scope.setMeshIps(response.data.v4prefixes[0]);
              $scope.wizard.ip.v4ClientSubnet = response.data.v4prefixes[1];
            }
            $scope.wizard.ip.v6Prefix=response.data.v6prefixes[0];
            $scope.state.registerips.steps++;
            $scope.state.registerips.progress.configWritten = 'success';
          }, function(response) {
            //error callback
            $scope.state.registerips.progress.confirmed = 'error';
          }
        );
      }

      $scope.setMeshIps = function(subnet) {
        var ipAddress = ip.cidrSubnet(subnet).firstAddress;
        for (var i=0; i <Object.keys(state.wifi.devices).length; i++) {
          $scope.wizard.ip.v4['radio'+i] = ipAddress.toString();
          ipAddress = $scope.getNextIP(ipAddress.toString());
        }

        if ($scope.wizard.ip.meshLan) {
          $scope.wizard.ip.v4.lan = ipAddress;
        }
      }

      $scope.getNextIP = function(ipAddress) {
        var buf = new Buffer(128);
        var offset = 64;
        ip.toBuffer(ipAddress, buf, offset);
        if (buf[67] < 255) {
          buf[67] = buf[67]+1;
        } else  if (buf[66] < 255) {
          buf[66] = buf[66]+1;
          buf[67] = 0;
        } else {
          console.log('too lazy to implement this now. is it even needed? maybe it is not even neccessary, because mesh net is realy small')
        }
        return ip.toString(buf, offset, 4);
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

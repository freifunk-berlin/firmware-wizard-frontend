'use strict';

module.exports = function(app) {
  app.controller('WizardCtrl', [
    '$scope', 'leafletData', '$http', '$filter', 'downloadFile',
    'jsonrpc', 'Upload', '$uibModal', '$timeout', '$location', 'session',
    'router',
    function($scope, leafletData, $http, $filter, downloadFile,
             jsonrpc, Upload, $uibModal, $timeout, $location, session,
             router) {

      $scope.currentPassword = '';

      $scope.showLoadConfigModal = function() {
        var modalInstance = $uibModal.open({
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'modal.html',
          controller: 'LoadConfigInstanceCtrl',
          scope: $scope
        });

        $scope.modalInstance = modalInstance;

        modalInstance.result.then(function(result) {
          $scope.wizard = result.wizard;
          $scope.state = result.state;
        }, function() {
          console.log('Modal dismissed at: ' + new Date());
        });
      };

      $scope.log = '';

      $scope.uploadVpnFiles = function(file, field) {
        var reader = new FileReader();
        reader.onload = function() {
          var content = reader.result.split(',')[1];
          switch (field) {
            case 'cert':
              $scope.wizard.internet.vpn.cert.value = content;
              $scope.wizard.internet.vpn.cert.filename = file[0].name;
              break;
            case 'key':
              $scope.wizard.internet.vpn.key.value = content;
              $scope.wizard.internet.vpn.key.filename = file[0].name;
              break;
            case 'takey':
              $scope.wizard.internet.vpn.takey.value = content;
              $scope.wizard.internet.vpn.takey.filename = file[0].name;
              break;
            case 'conf':
              $scope.wizard.internet.vpn.conf.value = content;
              $scope.wizard.internet.vpn.conf.filename = file[0].name;
              break;
            case 'meshcert':
              $scope.wizard.internet.meshvpn.cert.value = content;
              $scope.wizard.internet.meshvpn.cert.filename = file[0].name;
              break;
            case 'meshkey':
              $scope.wizard.internet.meshvpn.key.value = content;
              $scope.wizard.internet.meshvpn.key.filename = file[0].name;
              break;
            case 'meshtakey':
              $scope.wizard.internet.meshvpn.takey.value = content;
              $scope.wizard.internet.meshvpn.takey.filename = file[0].name;
              break;
            case 'meshconf':
              $scope.wizard.internet.meshvpn.conf.value = content;
              $scope.wizard.internet.meshvpn.conf.filename = file[0].name;
              break;
          }
        };
        if (file && file.length == 1) {
          if (!file[0].$error) {
            reader.readAsDataURL(file[0]);
          }
        }
      };

      $scope.toggleVpnList = function() {
        $scope.state.internet.showVpnList = !$scope.state.internet.showVpnList;
      };

      $scope.wizard = {
        router: {
          password: undefined,
          passwordVerify: undefined,
          name: undefined,
          sshkeys: undefined
        },
        contact: {
          name: undefined,
          email: undefined,
          options: {
            showOnContactPage: true,
            sendToMap: undefined
          }
        },
        location: {
          lat: undefined,
          lng: undefined,
          street: undefined,
          postalCode: undefined,
          city: undefined
        },
        internet: {
          share: false,
          limitDown: undefined,
          limitUp: undefined,
          vpn: {
            enabled: false,
            vpn03generate: false,
            cert: {},
            key: {},
            takey: {},
            conf: {}
          },
          meshvpn: {
            enabled: false,
            cert: {},
            key: {},
            takey: {},
            conf: {}
          }
        },
        ip: {
          v4: {
            radio0: undefined,
            radio1: undefined,
            lan: undefined
          },
          v6Prefix: undefined,
          distribute: true,
          v4ClientSubnet: undefined
        },
        monitoring: {
          enabled: false
        },
        wifi: {}
      };

      $scope.onLocationUpdate = function(location) {
        angular.extend($scope.wizard.location, location);
      }

      $scope.state = {
        apply: {
          uploaded: undefined,
          success: undefined,
          error: undefined
        },
        sshkeys: {},
        internet: {
          vpn03: {
            generate: true
          },
          showVpnList: false
        },
        ip: {
          register: false,
          v4ClientSubnetSize: 27
        },
        monitoring: {
          enabled: false
        },
        system: {},
        wifi: {
          advanced: false,
          devices: {}
        }
      };

      angular.element(document).ready(function() {
        if (!sessionManager.isAuthenticated()) {
          $scope.showAuthenticationModal()
            .then(function() {
              $scope.saveRouterInformation();
            });
        } else {
          $scope.saveRouterInformation();
        }
      });

      $scope.loadRouterInformation = function() {
        if (!sessionManager.isAuthenticated()) {
          $scope.showAuthenticationModal()
            .then(function() {
              $scope.saveRouterInformation();
            });
        } else {
          $scope.saveRouterInformation();
        }
      };

      $scope.saveRouterInformation = function() {
        routerInformation.gatherRouterInformation()
          .then(function() {
            $scope.state.system = routerInformation.getSystemInformation();
            var wirelessInfo = routerInformation.getWirelessInformation();
            Object.keys(wirelessInfo).map(function(key, index) {
              $scope.state.wifi.devices[key] = {
                scanFilter: 'freifunk'
              };
              if (wirelessInfo[key].up && Object.keys(wirelessInfo[key].interfaces).length > 0) {
                routerInformation.scanForWifi(wirelessInfo[key].interfaces[0].ifname)
                  .then(function(data) {
                    $scope.state.wifi.devices[key].scan = data.results;
                  });
              }
              if (wirelessInfo[key].config.hwmode.includes('11a')) {
                $scope.state.wifi.devices[key].mode = '11a';
                $scope.wizard.wifi[key] = {
                  mode: 'adhoc',
                  channel: 36,
                  ssid: 'intern-ch36-bat1.freifunk.net',
                  bssid: '02:ca:ff:ee:ba:36',
                  batVlan: 1
                };
              } else {
                $scope.state.wifi.devices[key].mode = 'legacy';
                $scope.wizard.wifi[key] = {
                  mode: 'adhoc',
                  channel: 13,
                  ssid: 'intern-ch13-berlin.freifunk.net',
                  bssid: '02:ca:ff:ee:ba:be',
                  batVlan: 1
                };
              }
            });
          });
      };

      $scope.applyDefaults = function(device, config) {
        var channel;
        if (device.mode === '11a') {
          channel = 36;
        } else if (device.mode === 'legacy') {
          channel = 13;
        }
        if (!channel) {
          console.error('device does not support 5 or 2.4 GHz');
          return;
        }
        angular.extend(config, {
          mode: 'adhoc',
          channel: channel,
          ssid: 'intern-ch' + channel + '.freifunk.net',
          meshId: 'freifunk',
          batVlan: 1,
          bssid: '02:ca:ff:ee:ba:be'
        });
      };

      $scope.applyScan = function(device, config, scan) {
        var batRegexp = /.*bat([0-9]*).*/g;
        var batMatch = batRegexp.exec(scan.ssid);
        var batVlan = batMatch ? parseInt(batMatch[1]) : 1;

        angular.extend(config, {
          mode: scan.mode === 'Master' ? 'sta' : scan.mode,
          channel: scan.channel,
          ssid: scan.ssid,
          meshId: scan.meshId,
          bssid: scan.bssid,
          batVlan: batVlan
        });
      };

      $scope.hasError = function(field) {
        var form = $scope.wizardForm;
        return (form.$submitted || form[field].$dirty) &&
          form[field].$invalid && form[field].$error;
      };

      $scope.hasSuccess = function(field) {
        var form = $scope.wizardForm;
        return form[field].$dirty && form[field].$valid;
      };

      $scope.formFeedback = function(field) {
        return {
          'has-error': $scope.hasError(field),
          'has-success': $scope.hasSuccess(field),
        };
      };

      $scope.formControlFeedback = function(field) {
        return {
          'fa-times': $scope.hasError(field),
          'fa-check': $scope.hasSuccess(field),
        };
      };

      $scope.pow = Math.pow;

    }
  ]);
};

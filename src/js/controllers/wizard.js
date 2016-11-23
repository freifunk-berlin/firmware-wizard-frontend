'use strict';

module.exports = function(app) {
  app.controller('WizardCtrl', [
    '$scope', 'leafletData', '$http', '$filter', 'downloadFile', '$translate',
    'jsonrpc', 'Upload', '$uibModal', '$timeout', '$location', 'authentication',
    function($scope, leafletData, $http, $filter, downloadFile, $translate,
             jsonrpc, Upload, $uibModal, $timeout, $location, authentication) {

      // jscs:disable maximumLineLength
      var onlineCheckUrl = 'https://weimarnetz.de/health?callback=JSON_CALLBACK';
      $scope.selectedLanguage = $translate.proposedLanguage() || $translate.use();
      $scope.$watch('selectedLanguage', function(language) {
        $translate.use(language);
      }, true);

      console.log(authentication.isAuthenticated());

      $scope.routerUbusUrl = $location.protocol() + '://' + $location.host() + '/ubus';
      $scope.currentPassword = '';
      $scope.submit = function() {
        if ($scope.wizardForm.$invalid) {
          return;
        }
        if (!authentication.isAuthenticated()) {
          $scope.showAuthenticationModal();
        }
        console.log('applying');
        // due to an ubox bug we have to convert lat and lon to strings
        var myWizard = angular.copy($scope.wizard);
        myWizard.location.lat = $scope.wizard.location.lat && '' + $scope.wizard.location.lat;
        myWizard.location.lng = $scope.wizard.location.lng && '' + $scope.wizard.location.lng;
        jsonrpc.call('ffwizard', 'apply', {'config': myWizard})
          .then(function(data) {
            console.log('upload done');
            $scope.state.apply.uploaded = true;
            if (data.status == 'success') {
              $scope.state.apply.success = true;
            } else {
              $scope.state.apply.success = false;
            }
            console.log(data);
          })
          .catch(function(data) {
            $scope.state.apply.error = true;
            $scope.state.apply.uploaded = false;
            console.log('error');
            console.log(data);
          });
      };

      $scope.showAuthenticationModal = function() {
        var authModalInstance = $uibModal.open({
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'passwordModal.html',
          controller: 'AuthenticationCtrl',
          scope: $scope
        });

        $scope.authModalInstance = authModalInstance;

        authModalInstance.result.then(function(result) {
          console.log(authentication.isAuthenticated());
        });

      };

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
        wifi: {
          radio0: {
            mode: 'mesh',
            channel: 36,
            ssid: 'intern-ch36-bat1.freifunk.net',
            meshId: 'freifunk',
            batVlan: 1
          },
          radio1: {
            mode: 'sta',
            channel: 1,
            ssid: 'rhxb-so-5.freifunk.net',
            batVlan: 1
          }
        }
      };

      $scope.state = {
        apply: {
          uploaded: undefined,
          success: undefined,
          error: undefined
        },
        map: {
          markers: {
            router: {
              lat: 52.52080,
              lng: 13.40942,
              focus: true,
              draggable: true
            }
          },
          center: {
            lat: 52.52080,
            lng: 13.40942,
            zoom: 10
          }
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
        wifi: {
          advanced: false,
          devices: {
            radio0: {
              '5GHz': true,
              scanFilter: 'freifunk',
              scan: [
                {
                  mode: 'Master',
                  ssid: 'freifunk-rhxb-zwingli',
                  channel: 108,
                  signal: -50
                },
                {
                  mode: 'Mesh Point',
                  ssid: 'intern-ch36-bat5.freifunk.net',
                  meshId: 'freifunk',
                  channel: 36,
                  signal: -60
                },
                {
                  mode: 'Master',
                  ssid: 'doener3000',
                  channel: 48,
                  signal: -53
                },
                {
                  mode: 'Ad-Hoc',
                  ssid: 'intern-ch136.freifunk.net',
                  channel: 136,
                  bssid: '12:36:ca:ff:ee:ba:be',
                  signal: -70
                }
              ]
            },
            radio1: {
              '2.4GHz': true,
              scanFilter: 'freifunk'
            }
          }
        }
      };

      angular.element(document).ready(function() {
        if (!authentication.isAuthenticated()) {
          $scope.showAuthenticationModal();
        }
        jsonrpc.call(authentication.getSessionId(), authentication.getApiUrl(), 'iwinfo', 'scan', {'device': 'wlan0-dhcp-2'})
          .then(function(data) {
            $scope.state.wifi.devices.radio0.scan = data.results;
          });

      });

      $scope.$on('leafletDirectiveMarker.dragend', function(event, args) {
        $scope.state.map.markers.router.lat = args.model.lat;
        $scope.state.map.markers.router.lng = args.model.lng;
      });

      // copy router name to map marker
      $scope.$watch('wizard.router.name', function(name) {
        $scope.state.map.markers.router.message =
          '<strong>' + (name || 'Your router') + '</strong><br>' +
          'Drag me to the correct location!';
      });

      // update wizard scope var and keep map centered on marker
      $scope.$watch('state.map.markers.router', function(router) {
        $scope.wizard.location.lat = router.lat;
        $scope.wizard.location.lng = router.lng;

        $scope.state.map.center.lat = router.lat;
        $scope.state.map.center.lng = router.lng;

        // search address
        $scope.getAddress(router.lat, router.lng);
      }, true);

      $scope.$watch('wizard.location', function(location) {
        $scope.state.map.markers.router.lat = location.lat;
        $scope.state.map.markers.router.lng = location.lng;
      }, true);

      // set marker to current location
      var mapRegistered = false;
      $scope.getLocation = function() {
        $scope.state.map.searchingGeolocation = true;
        leafletData.getMap().then(function(map) {
          map.locate({setView: true, maxZoom: 16, enableHighAccuracy: true});
          if (!mapRegistered) {
            mapRegistered = true;
            map.on('locationfound', function(e) {
              // set marker position
              $scope.state.map.markers.router.lat = e.latitude;
              $scope.state.map.markers.router.lng = e.longitude;

              $scope.state.map.searchingGeolocation = false;
            });
            map.on('locationerror', function onLocationFound(e) {
              $scope.state.map.searchingGeolocation = false;
            });
          }
        });
      };
      // get location at init time
      $scope.getLocation();

      // get address from geolocation
      $scope.getAddress = function(lat, lng) {
        $scope.searchingAddress = false;
        if ($scope.isOnline()) {
          $scope.searchingAddress = true;
          $http.get('//nominatim.openstreetmap.org/reverse', {
            params: {
              format: 'json',
              lat: lat,
              lon: lng
            }
          }).success(function(data) {
            $scope.searchingAddress = false;
            var address = data && data.address;
            if (!address) {return;}

            var street = data.address.road;
            var streetNo = data.address.house_number;
            var postalCode = data.address.postcode;
            // Addresses in Berlin have no city but only a state field
            var city = data.address.city || data.address.state;

            angular.extend($scope.wizard.location, {
              street: street && streetNo ? street + ' ' + streetNo : street,
              postalCode: data.address.postcode,
              city: city
            });

          }).error(function(data) {
            $scope.searchingAddress = false;
          });
        }
      };

      $scope.applyDefaults = function(device, config) {
        var channel;
        if (config.capabilities['5GHz']) {
          channel = 36;
        } else if (config.capabilities['2.4GHz']) {
          channel = 13;
        }
        if (!channel) {
          console.error('device does not support 5 or 2.4 GHz');
          return;
        }
        angular.extend(config, {
          mode: 'Mesh Point',
          channel: channel,
          ssid: 'intern-ch' + channel + '-bat1.freifunk.net',
          meshId: 'freifunk',
          batVlan: 1,
          bssid: undefined
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

      $scope.downloadConfig = function() {
        downloadFile(
          'config.json',
          $filter('json')($scope.wizard),
          'application/json',
          true
        );
      };

      var online = false;
      $http.jsonp(onlineCheckUrl, {'timeout': 50})
        .then(function success(response) {
          online = true;
        }, function failure(response) {
          online = false;
        });

      $scope.isOnline = function() {
        return online;
      };

      $scope.pow = Math.pow;

    }
  ]);
};

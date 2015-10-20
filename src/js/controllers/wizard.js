'use strict';

module.exports = function(app) {
  app.controller('WizardCtrl', [
    '$scope', 'leafletData', '$http', '$filter', 'downloadFile', '$translate',
    'jsonrpc',
    function($scope, leafletData, $http, $filter, downloadFile, $translate,
             jsonrpc) {

      $scope.changeLang = function() {
        $translate.use($scope.selectedLanguage);
      };

      var autoDetectedLanguage = $translate.proposedLanguage();
      $scope.selectedLanguage =  autoDetectedLanguage;

      $scope.wizard = {
        router: {
          password: undefined,
          passwordVerify: undefined,
          name: undefined
        },
        contact: {
          name: undefined,
          email: undefined
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
          vpn03: {
            enabled: true,
            cert: undefined,
            key: undefined
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
        internet: {
          vpn03: {
            generate: true
          }
        },
        ip: {
          register: true,
          v4ClientSubnetSize: 27
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

      jsonrpc.login('http://192.168.1.1/ubus', 'root', 'doener')
        .then(function(data) {
          return jsonrpc.call('iwinfo', 'scan', {device: 'wlan1'});
        })
        .then(function(data) {
          $scope.state.wifi.devices.radio0.scan = data.results;
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

      // helpers for validation
      $scope.hasError = function(field) {
        var form = $scope.wizardForm;
        return (form.$submitted || form[field].$dirty) && form[field].$invalid;
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

      $scope.pow = Math.pow;

    }
  ]);
};

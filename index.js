var wizard = angular.module('WizardApp', [
  'ui.bootstrap', 'ngAnimate', 'leaflet-directive', 'pascalprecht.translate'
]);

wizard.controller('WizardCtrl', [
  '$scope', 'leafletData', '$http', '$filter', 'downloadFile', '$translate',
  function($scope, leafletData, $http, $filter, downloadFile, $translate) {

    $scope.changeLang = function(){
      $translate.use($scope.selectedLanguage);
    };

    var autoDetectedLanguage = $translate.use();
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
        distribute: false,
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
                mode: 'master',
                ssid: 'freifunk-rhxb-zwingli',
                channel: 108,
                signal: -50
              },
              {
                mode: 'mesh',
                ssid: 'intern-ch36-bat5.freifunk.net',
                meshId: 'freifunk',
                channel: 36,
                signal: -60
              },
              {
                mode: 'master',
                ssid: 'doener3000',
                channel: 48,
                signal: -53
              },
              {
                mode: 'adhoc',
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
      $http.get('//maps.googleapis.com/maps/api/geocode/json', {
        params: {
          latlng: lat + ',' + lng
        }
      }).success(function(data) {
        $scope.searchingAddress = false;
        var address = data && data.results && data.results.length &&
          data.results[0].address_components;
        if (!address) {return;}

        var streetNo = _.get(_.find(address, {types: ['street_number']}),
                             'long_name');
        var street = _.get(_.find(address, {types: ['route']}), 'long_name');
        var postalCode = _.get(_.find(address, {types: ['street_number']}),
                             'long_name');

        angular.extend($scope.wizard.location, {
          street: street && streetNo ? street + ' ' + streetNo : undefined,
          postalCode: _.get(_.find(address, {types: ['postal_code']}),
                            'long_name'),
          city: _.get(_.find(address, {types: ['locality']}), 'long_name')
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
        mode: 'mesh',
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
        mode: scan.mode === 'master' ? 'sta' : scan.mode,
        channel: scan.channel,
        ssid: scan.ssid,
        meshId: scan.meshId,
        bssid: scan.bssid,
        batVlan: batVlan
      });
    };

    $scope.hasError = function(field) {
      var form = $scope.wizardForm;
      return (form.$submitted || form[field].$dirty) && form[field].$invalid;
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

// http://odetocode.com/blogs/scott/archive/2014/10/13/confirm-password-validation-in-angularjs.aspx
wizard.directive('compareTo', function() {
  return {
    require: 'ngModel',
    scope: {
      otherModelValue: '=compareTo'
    },
    link: function(scope, element, attributes, ngModel) {

      ngModel.$validators.compareTo = function(modelValue) {
        return modelValue == scope.otherModelValue;
      };

      scope.$watch('otherModelValue', function() {
        ngModel.$validate();
      });
    }
  };
});

wizard.filter('base64encode', function() {
  return function(input) {
    return btoa(input);
  };
});

wizard.filter('range', function() {
  return function(input, a, b) {
    var res = [];
    var i;
    if (a < b) {
      for (i = a; i < b + 1; i++) {
        res.push(i);
      }
    } else {
      for (i = a; i > b - 1; i--) {
        res.push(i);
      }
    }

    return res;
  };
});

// allow data: hrefs
wizard.config(['$compileProvider', function($compileProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|mailto|data):/);
}]);

wizard.config(function ($translateProvider) {
  $translateProvider.translations('en', {
    heading: 'Router configuration wizard',
    basicRouterSetup: 'Basic router setup',
    passwordRequired: 'A password is required.',
    passwordMinLength: 'A password must have at least 6 characters.',
    passwordVerification: 'Router password verification',
    passwordMatch: 'Passwords have to match.',
    password: 'New router password',
    contactDetails: 'Contact details',
    yourName: 'Your name',
    routerLocation: 'Router location',
    getLocation: 'Get my location',
    street: 'Street and house no.',
    postalCode: 'Postal code',
    city: 'City',
    internetSharing: 'Internet sharing',
    transferSpeed: 'Transfer speed limit in Mbps',
    shareInternet: 'Share internet',
    advancedWifi: 'Advanced wifi options',
    showAdvanced: 'Show advanced wifi options',
    ip: 'IP addresses',
    registerIP: 'Register new IP addresses',
    meshViaLAN: 'Mesh via LAN',
    ipDistribute: 'Distribute client IP addresses',
    download: 'Download config',
    operatedBy: 'is operated by',
    generateCertificate: 'Generate new VPN03 certificate and key for this router',
    save: 'Save & reboot',
    configIncorrect: 'The data you entered is invalid. Please correct them before saving.',
  });
  $translateProvider.translations('de', {
    heading: 'Router configuration wizard',
    basicRouterSetup: 'Grundlegende Routereinstellungen',
    passwordRequired: 'Ein Passwort wird benötigt',
    passwordMinLength: 'Das Passwort muss mindestens 6 Stellen haben.',
    passwordVerification: 'Router Passwort Bestätigung',
    passwordMatch: 'Passwörter müssen übereinstimmen',
    password: 'Passwort für neuen Router',
    contactDetails: 'Kontakdetails',
    yourName: 'Dein Name',
    routerLocation: 'Router Standort',
    getLocation: 'Meinen Standort herausfinden',
    street: 'Straße und Hausnummer',
    postalCode: 'Postleitzahl',
    city: 'Stadt',
    internetSharing: 'Internet teilen',
    transferSpeed: 'Geschwindigkeit in Mbps',
    shareInternet: 'Internet teilen',
    advancedWifi: 'Erweiterte W-LAN Einstellungen',
    showAdvanced: 'Erweiterte W-LAN Einstellungen anzeigen',
    ip: 'IP Adressen',
    registerIP: 'Neue IP-Adressen registrieren',
    meshViaLAN: 'Mesh via LAN',
    ipDistribute: 'Distribute client IP addresses',
    download: 'Konfiguration runterladen',
    operatedBy: 'wird betrieben vom',
    generateCertificate: 'VPN03 Zertifikat und Schlüssel für diesen Router generieren.',
    save: 'Speichern & neustarten',
    configIncorrect: 'Die Daten die du eingegeben hast sind nicht korrekt. Bitte korrigiere sie zuerst',
  });
  $translateProvider.fallbackLanguage(['en', 'de']);
  $translateProvider.determinePreferredLanguage();
});

wizard.factory('downloadFile',
  ['$document', 'base64encodeFilter', function($document, base64encode) {
    return function(filename, data, mimeType, base64, charset) {
      var href = 'data:' + mimeType +
        (charset ? ';charset:' + charset : '') +
        (base64 ? ';base64' : '') +
        ',' + (base64 ? base64encode(data) : data);

      var element = angular.element('<a>dummy</a>');
      element.attr('href', href);
      element.attr('download', filename);
      element.css('display', 'none');

      var body = $document.find('body').eq(0);
      body.append(element);

      element[0].click();

      element.detach();
    };
  }]
);

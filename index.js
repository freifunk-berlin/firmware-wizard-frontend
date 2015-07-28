var wizard = angular.module('WizardApp', [
  'ui.bootstrap', 'ngAnimate', 'leaflet-directive'
]);

wizard.controller('WizardCtrl', [
  '$scope', 'leafletData', '$http', function($scope, leafletData, $http) {
    var routerMarker = {
      lat: 52.52080,
      lng: 13.40942,
      message: 'Your router',
      focus: true,
      draggable: true
    };

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
        marker: routerMarker,
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
        v4: [
          {type: 'Wifi 2.4GHz', ip: undefined},
          {type: 'Wifi 5GHz', ip: undefined},
          {type: 'LAN', ip: undefined}
        ],
        v6Prefix: undefined,
        distribute: false,
        v4ClientSubnet: undefined
      },
      wifi: {

      }
    };

    $scope.state = {
      map: {
        markers: {
          router: routerMarker,
        },
        center: {
          lat: 52.52080,
          lng: 13.40942,
          zoom: 10
        }
      }
    };

    $scope.$on('leafletDirectiveMarker.dragend', function(event, args) {
      $scope.state.map.markers.router.lat = args.model.lat;
      $scope.state.map.markers.router.lng = args.model.lng;
    });

    // copy router name to map marker
    $scope.$watch('wizard.router.name', function(name) {
      $scope.state.map.markers.router.message = name;
    });

    // keep map centered on marker
    $scope.$watch('wizard.location.marker', function(marker) {
      $scope.state.map.center.lat = marker.lat;
      $scope.state.map.center.lng = marker.lng;

      // search address
      $scope.getAddress(marker.lat, marker.lng);
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

  }
]);

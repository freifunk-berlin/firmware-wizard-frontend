var wizard = angular.module('WizardApp', [
  'ui.bootstrap', 'ngAnimate', 'leaflet-directive'
]);

wizard.controller('WizardCtrl', [
  '$scope', 'leafletData', '$http', function($scope, leafletData, $http) {
    $scope.wizard = {};
    $scope.map = {
      markers: {
        router: {
          lat: 52.52080,
          lng: 13.40942,
          message: 'Your router',
          focus: true,
          draggable: true
        }
      },
      center: {
        lat: 52.52080,
        lng: 13.40942,
        zoom: 10
      }
    };

    $scope.$on('leafletDirectiveMarker.dragend', function(event, args) {
      $scope.map.markers.router.lat = args.model.lat;
      $scope.map.markers.router.lng = args.model.lng;
    });

    // copy router name to map marker
    $scope.$watch('wizard.routerName', function(routerName) {
      $scope.map.markers.router.message = routerName;
    });

    // keep map centered on marker
    $scope.$watch('map.markers.router', function(router) {
      $scope.map.center.lat = router.lat;
      $scope.map.center.lng = router.lng;

      // search address
      $scope.getAddress(router.lat, router.lng);
    }, true);

    // set marker to current location
    var mapRegistered = false;
    $scope.getLocation = function() {
      $scope.map.searchingGeolocation = true;
      leafletData.getMap().then(function(map) {
        map.locate({setView: true, maxZoom: 16, enableHighAccuracy: true});
        if (!mapRegistered) {
          mapRegistered = true;
          map.on('locationfound', function(e) {
            // set marker position
            $scope.map.markers.router.lat = e.latitude;
            $scope.map.markers.router.lng = e.longitude;

            $scope.map.searchingGeolocation = false;
          });
          map.on('locationerror', function onLocationFound(e) {
            $scope.map.searchingGeolocation = false;
          });
        }
      });
    };

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

        angular.copy({
          routerStreet: street && streetNo ? street + ' ' + streetNo :
            undefined,
          routerPostalCode: _.get(_.find(address, {types: ['postal_code']}),
                                  'long_name'),
          routerCity: _.get(_.find(address, {types: ['locality']}),
                                  'long_name')
        }, $scope.wizard);

      }).error(function(data) {
        $scope.searchingAddress = false;
      });

    };

  }
]);

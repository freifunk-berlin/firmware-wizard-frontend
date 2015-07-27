var wizard = angular.module('WizardApp', [
  'ui.bootstrap', 'ngAnimate', 'leaflet-directive'
]);

wizard.controller('WizardCtrl', [
  '$scope', 'leafletData', function($scope, leafletData) {
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
    }, true);

    // set marker to current location
    var mapRegistered = false;
    $scope.getLocation = function() {
      $scope.map.searching = true;
      leafletData.getMap().then(function(map) {
        map.locate({setView: true, maxZoom: 16, enableHighAccuracy: true});
        if (!mapRegistered) {
          mapRegistered = true;
          map.on('locationfound', function(e) {
            // set marker position
            $scope.map.markers.router.lat = e.latitude;
            $scope.map.markers.router.lng = e.longitude;

            $scope.map.searching = false;
          });
          map.on('locationerror', function onLocationFound(e) {
            console.log('error');
            $scope.map.searching = false;
          });
        }
      });
    };

  }
]);

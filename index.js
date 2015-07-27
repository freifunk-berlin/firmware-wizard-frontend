var wizard = angular.module('WizardApp', ['ui.bootstrap', 'ngAnimate', 'leaflet-directive']);

wizard.controller('WizardCtrl', ['$scope', function($scope) {
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
    console.log('bla');
    $scope.map.center.lat = router.lat;
    $scope.map.center.lng = router.lng;
  }, true);

}]);

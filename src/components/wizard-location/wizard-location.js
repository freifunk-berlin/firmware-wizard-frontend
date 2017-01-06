import { module } from 'angular';

export default module('app.components.wizard-location', []).component('wizardLocation', {
  bindings: {
    name: '<',
    location: '<',
    onLocationUpdate: '&',
  },
  controller: class WizardLocationCtrl {
    constructor($http, $scope, leafletData, online) {
      'ngInject';

      this.$http = $http;
      this.leafletData = leafletData;
      this.online = online;

      // map options
      this.map = {
        center: {
          lat: 52.52080,
          lng: 13.40942,
          zoom: 10,
        },
        defaults: {
          scrollWheelZoom: false,
          doubleClickZoom: false,
        },
        events: {
          map: {
            enable: ['dblclick'],
            logic: 'emit',
          },
        },
        markers: {
          router: {
            lat: 52.52080,
            lng: 13.40942,
            focus: true,
            draggable: true,
          },
        },
      };

      $scope.$watch('$ctrl.name', this.updateName.bind(this));
      $scope.$watchCollection('$ctrl.location', this.updateLocationFromInput.bind(this));
      $scope.$on('leafletDirectiveMap.dblclick', (_, args) => this.updateLocationFromLatLng(args.leafletEvent.latlng));
      $scope.$on('leafletDirectiveMarker.dragend', (_, args) => this.updateLocationFromLatLng(args.model));
      $scope.$watchCollection('$ctrl.map.markers.router', (router) => {
        this.updateCenterFromLocation(router);
        this.updateLocationOutput();
        this.updateAddressFromLocation(router);
      });
      this.getLocation();
    }

    // set marker to current location
    getLocation() {
      this.mapRegistered = false;
      this.searchingGeolocation = true;
      this.leafletData.getMap().then((map) => {
        map.locate({setView: true, maxZoom: 16, enableHighAccuracy: true});
        if (this.mapRegistered) return;

        this.mapRegistered = true;
        map.on('locationfound', (event) => {
          this.updateLocationFromLatLng({lat: event.latitude, lng: event.longitude});
          this.searchingGeolocation = false;
        });
        map.on('locationerror', () => (this.searchingGeolocation = false));
      });
    }

    updateCenterFromLocation(latlng) {
      if (!latlng) return;
      this.map.center.lat = latlng.lat;
      this.map.center.lng = latlng.lng;
    }

    updateLocationFromInput(location) {
      this.updateLocationFromLatLng(location);
      this.street = location && location.street;
      this.postalCode = location && location.postalCode;
      this.city = location && location.city;
    }

    updateLocationFromLatLng(latlng) {
      this.map.markers.router.lat = (latlng && latlng.lat) || 52.52080;
      this.map.markers.router.lng = (latlng && latlng.lng) || 13.40942;
    }

    updateName(name) {
      this.map.markers.router.message =
        `<strong>${name || 'Your router'}</strong><br>Drag me to the correct location!`;
    }

    updateAddressFromLocation(location) {
      this.searchingAddress = true;
      this.$http.get(
        '//nominatim.openstreetmap.org/reverse',
        {params: {format: 'json', lat: location.lat, lon: location.lng}},
      ).then(
        (response) => {
          this.searchingAddress = false;
          const address = response.data && response.data.address;
          if (!address) return;

          const street = address.road;
          const streetNo = address.house_number;
          this.street = street && streetNo ? `${street} ${streetNo}` : street;
          this.postalCode = address.postcode;
          // Addresses in Berlin have no city but only a state field
          this.city = address.city || address.state;

          this.updateLocationOutput();
        },
        () => (this.searchingAddress = false),
      );
    }

    updateLocationOutput() {
      const location = {
        lat: this.map.markers.router.lat,
        lng: this.map.markers.router.lng,
        street: this.street,
        postalCode: this.postalCode,
        city: this.city,
      };
      this.onLocationUpdate({location});
    }
  },
  template: require('./wizard-location.html'),
});

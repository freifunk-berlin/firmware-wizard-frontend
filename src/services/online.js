import { module } from 'angular';

export default module('app.services.online', [])
  .service('online', class OnlineService {
    constructor($http, $timeout, $window) {
      'ngInject';
      this.$http = $http;
      this.$timeout = $timeout;
      this.check();

      // update when browser detects online/offline changes
      const boundCheck = this.check.bind(this);
      $window.addEventListener('online', boundCheck);
      $window.addEventListener('offline', boundCheck);
    }

    check() {
      // wait a bit before actually checking (network may not be fully initialized)
      // TODO: use a freifunk url with enabled CORS
      this.$timeout(() => this.$http.head('https://paperhive.org/api/').then(
        () => this.isOnline = true,
        () => this.isOnline = false
      ), 100);
    }
  });

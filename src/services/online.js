import { module } from 'angular';

export default module('app.services.online', [])
  .service('online', class OnlineService {
    constructor($http, $window) {
      'ngInject';
      this.$http = $http;
      this.check();

      // update when browser detects online/offline changes
      const boundCheck = this.check.bind(this);
      $window.addEventListener('online', boundCheck);
      $window.addEventListener('offline', boundCheck);
    }

    check() {
      this.isOnline = undefined;
      this.$http.head('https://paperhive.org/api/').then(
        () => this.isOnline = true,
        () => this.isOnline = false
      );
    }
  });

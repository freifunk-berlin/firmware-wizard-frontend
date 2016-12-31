import { module } from 'angular';

export default module('app.services.online', [])
  .service('online', class OnlineService {
    constructor($http) {
      'ngInject';
      this.$http = $http;
      this.check();
    }

    check() {
      this.isOnline = undefined;
      this.$http.head('https://paperhive.org/api/').then(
        () => this.isOnline = true,
        () => this.isOnline = false
      );
    }
  });

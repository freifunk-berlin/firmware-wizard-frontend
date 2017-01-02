import { module } from 'angular';

export default module('app.services.online', [])
  .service('online', class OnlineService {
    constructor($http, $q, $timeout, $window) {
      'ngInject';
      this.$http = $http;
      this.$q = $q;
      this.$timeout = $timeout;
      this.currentProbe = this.probe();

      // update when browser detects online/offline changes
      const boundProbeLater = this.probeLater.bind(this);
      $window.addEventListener('online', boundProbeLater);
      $window.addEventListener('offline', boundProbeLater);
    }

    probe() {
      // TODO: use a freifunk url with enabled CORS
      const probePromise = this.$http.head('https://paperhive.org/api/');
      probePromise.then(
        () => this.isOnline = true,
        () => this.isOnline = false,
      );
      return probePromise;
    }

    probeLater() {
      // wait a bit before actually checking (network may not be fully initialized)
      const probePromise = this.$q(
        (resolve, reject) => this.$timeout(() => this.probe().then(resolve, reject), 100)
      );
      this.currentProbe = probePromise;
      return probePromise;
    }
  });

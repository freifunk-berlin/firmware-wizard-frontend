import { module } from 'angular';

export default module('app.services.router', [])
  .service('router', class RouterService {
    constructor($q, jsonrpc, session) {
      'ngInject';

      this.$q = $q;
      this.jsonrpc = jsonrpc;
      this.session = session;
    }

    call(object, method, args) {
      if (!this.session.connection) {
        return this.$q.reject(new Error('not connected'));
      }
      return this.jsonrpc.call(
        this.session.connection.apiUrl,
        this.session.getSessionId(),
        object,
        method,
        args,
      );
    }

    applyConfig(config) {
      return this.call('ffwizard', 'apply', {config});
    }

    getConfig() {
      return this.call('ffwizard', 'getConfig', {});
    }

    getIwinfoFreqlist(device) {
      return this.call('iwinfo', 'freqlist', {device});
    }

    getNetworkWireless() {
      return this.call('network.wireless', 'status', {});
    }

    getOlsrLinks() {
      return this.call('olsrd', 'links', {});
    }

    getOlsrNeighbors() {
      return this.call('olsrd', 'neighbors', {});
    }

    getSystemBoard() {
      return this.call('system', 'board', {});
    }

    getSystemInfo() {
      return this.call('system', 'info', {});
    }

    scanWifi(device) {
      return this.call('iwinfo', 'scan', {device});
    }
  });

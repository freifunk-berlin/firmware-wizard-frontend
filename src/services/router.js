import { module } from 'angular';

export default module('app.services.router', [])
  .service('router', class RouterService {
    constructor($q, jsonrpc, session) {
      'ngInject';
      this.$q = $q;
      this.jsonrpc = jsonrpc;
      this.session = session;
    }

    _call(object, method, args) {
      if (!this.session.connection) {
        return this.$q.reject(new Error('not connected'));
      }
      return jsonrpc.call(
        this.session.connection.apiUrl,
        this.session.getSessionId(),
        object,
        methods,
        args
      );
    }

    applyConfig(config) {
      return this.call('ffwizard', 'apply', {config});
    }

    getNetworkWireless() {
      return this.call('network.wireless', 'status', {});
    }

    getOlsrLinks() {
      return this.call('olsrd', 'links', {});
    }

    getSystemBoard() {
      return this.call('system', 'board', {});
    }

    scanWifi(device) {
      return this.call('iwinfo', 'scan', {'device': device});
    }

    updateInfo() {
      this.getSystemBoard().then(data => this.systemBoard = data);
      this.getNetworkWireless().then(data => this.networkWireless = data);
    }
  });

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
      return this.jsonrpc.call(
        this.session.connection.apiUrl,
        this.session.getSessionId(),
        object,
        method,
        args
      );
    }

    applyConfig(config) {
      return this._call('ffwizard', 'apply', {config});
    }

    getNetworkWireless() {
      return this._call('network.wireless', 'status', {});
    }

    getOlsrLinks() {
      return this._call('olsrd', 'links', {});
    }

    getSystemBoard() {
      return this._call('system', 'board', {});
    }

    scanWifi(device) {
      return this._call('iwinfo', 'scan', {'device': device});
    }

    updateInfo() {
      this.getSystemBoard().then(data => this.systemBoard = data);
      this.getNetworkWireless().then(data => this.networkWireless = data);
    }
  });

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
      const sessionId = this.session.authentication &&
        this.session.authentication.sessionId || this.session.initialSessionId;
      return jsonrpc.call(
        this.session.connection.apiUrl,
        sessionId,
        object,
        methods,
        args
      );
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

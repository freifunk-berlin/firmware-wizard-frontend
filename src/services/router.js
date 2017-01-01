import { module } from 'angular';

export default module('app.services.router', [])
  .service('router', class RouterService {
    constructor(jsonrpc, session) {
      'ngInject';
      this.jsonrpc = jsonrpc;
      this.session = session;
    }

    _call(object, method, args) {
      return jsonrpc.call(
        this.session.apiUrl,
        this.session.sessionId,
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

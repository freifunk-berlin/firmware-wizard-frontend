import { copy, module } from 'angular';

export default module('app.services.session', [])
  .service('session', class SessionService {
    // implements authentication as described in
    // https://wiki.openwrt.org/doc/techref/ubus#authentication

    constructor($location, $q, jsonrpc) {
      'ngInject';
      this.$q = $q;
      this.jsonrpc = jsonrpc;

      this.timeout = 3600; // seconds
      this.initialSessionId = '00000000000000000000000000000000';
      this.pending = false;

      // try to connect current url as apiUrl
      // const apiUrl = `${$location.protocol()}://${$location.host()}:${$location.path()}/ubus`;
      // this.initiate(apiUrl);
    }

    connectWithCredentials(apiUrl, username, password) {
      if (this.pending) {
        return this.$q.reject(new Error('another operation is pending'));
      }
      this.pending = true;

      this.error = undefined;
      this.activeSession = undefined;
      const expires = new Date();

      const args = {
        username,
        password: password || 'brains',
        timeout: this.timeout,
      };
      return this.jsonrpc.call(apiUrl, this.initialSessionId, 'session', 'login', args)
        .then(
          // successful http request
          data => {
            this.pending = false;

            // set expiry date
            expires.setSeconds(expires.getSeconds() + data.expires);

            // set active session
            this.activeSession = {
              apiUrl,
              expires,
              timeout: data.timeout,
              sessionId: data.ubus_rpc_session,
              data,
            };

            return this.activeSession;
          },
          // failed http request
          data => {
            this.pending = false;
            this.error = data;
            return this.$q.reject(data);
          }
        );
    }

    connectWithSession(session) {
      if (this.pending) {
        return this.$q.reject(new Error('another operation is pending'));
      }
      this.pending = true;

      this.error = undefined;
      this.activeSession = undefined;
      const expires = new Date();

      return this.jsonrpc.call(session.apiUrl, session.sessionId, 'session', 'access', {})
        .then(
          // successful http request
          data => {
            this.pending = false;

            // set new session
            this.activeSession = copy(session);
            // set expiry date
            if (session.timeout) {
              expires.setSeconds(expires.getSeconds() + session.timeout);
              this.activeSession.expires = expires;
            } else {
              this.activeSession.expires = undefined;
            }

            return this.activeSession;
          },
          // failed http request
          data => {
            this.pending = false;
            this.error = data;
            return this.$q.reject(data);
          }
        );
    }
  });

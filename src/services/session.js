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

            // fail on ubus/rpc level?
            const error = data.error || data.result[0] !== 0 && data.result;
            if (error) {
              this.error = error;
              return this.$q.reject(new Error('Authentication failed: ${error}'));
            }

            // set expiry date
            expires.setSeconds(expires.getSeconds() + data.result.expires);

            // set active session
            this.activeSession = {
              apiUrl,
              expires,
              timeout: data.result.timeout,
              sessionId: data.result[1].ubus_rpc_session,
              data: data.result[1],
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

            // fail on ubus/rpc level?
            const error = data.error || data.result[0] !== 0 && data.result;
            if (error) {
              this.error = error;
              return this.$q.reject(new Error('Authentication failed: ${error}'));
            }

            // set expiry date
            expires.setSeconds(expires.getSeconds() + session.timeout);

            // set new session
            this.activeSession = copy(session);
            this.activeSession.expires = expires;

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

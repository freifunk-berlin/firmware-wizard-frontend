import { module } from 'angular';

export default module('app.services.jsonrpc', [])
  .service('jsonrpc', class JsonrpcService {
    constructor($http, $q) {
      'ngInject';

      this.$http = $http;
      this.$q = $q;
    }

    call(apiUrl, session, object, method, args) {
      return this.$http.post(apiUrl, {
        jsonrpc: '2.0',
        id: 1,
        method: 'call',
        params: [session, object, method, args],
      }, {
        timeout: 10000,
      }).then((response) => {
        const data = response.data;
        if (!data) {
          return this.$q.reject(new Error('JSON RPC Error: no data'));
        }
        if (data.error) {
          return this.$q.reject(new Error(`JSON RPC Error: ${data.error.message} (code ${data.error.code})`));
        }
        if (data.result[0] !== 0) {
          return this.$q.reject(new Error(`JSON RPC Error: non-zero code ${data.result[0]}`));
        }
        return data.result[1];
      });
    }
  });

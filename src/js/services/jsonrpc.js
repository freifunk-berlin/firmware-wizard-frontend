'use strict';

module.exports = function(module) {
  module.factory('jsonrpc', ['$http', '$q', function($http, $q) {
    var jsonrpc = {};
    var call = function(session, object, method, args) {
      var deferred = $q.defer();

      $http.post(jsonrpc.apiUrl, {
        jsonrpc: '2.0',
        id: 1,
        method: 'call',
        params: [session, object, method, args]
      })
        .success(function(data) {
          if (data.error) {
            return deferred.reject('JSON RPC Error: ' + data.error.message +
                            ' (code ' + data.error.code + ')');
          }
          deferred.resolve(data.result[1]);
        })
        .error(function(data) {
          deferred.reject(data);
        });

      return deferred.promise;
    };

    jsonrpc.login = function(apiUrl, username, password) {
      jsonrpc.apiUrl = apiUrl;
      return call('00000000000000000000000000000000', 'session', 'login',
           {'username': 'root', 'password': 'doener', 'timeout': 3600})
        .then(function(data) {
          jsonrpc.session = data.ubus_rpc_session;
        });
    };

    jsonrpc.call = function(object, method, args) {
      return call(jsonrpc.session, object, method, args);
    };

    return jsonrpc;
  }]);
};

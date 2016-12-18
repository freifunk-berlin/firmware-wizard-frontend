'use strict';

module.exports = function(app) {
  app.factory('jsonrpc', ['$http', '$q', function($http, $q) {
    var jsonrpc = {};

    jsonrpc.call = function(apiUrl, session, object, method, args) {
      var deferred = $q.defer();

      $http.post(apiUrl, {
        jsonrpc: '2.0',
        id: 1,
        method: 'call',
        params: [session, object, method, args]
      }, {
        timeout: 10000
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

    return jsonrpc;
  }]);
};

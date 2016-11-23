/**
 * Created by andi on 13.11.16.
 */
'use strict';

module.exports = function(app) {
  app.factory('authentication', ['$q', 'jsonrpc', function($q, jsonrpc) {
    var INITIAL_SESSION_ID = '00000000000000000000000000000000';
    var SESSION_TIMEOUT_IN_SECONDS = 3600;
    var factory = {};
    var sessionId = INITIAL_SESSION_ID;
    var apiUrl = '';
    var sessionStartTimestamp = 0;

    factory.isAuthenticated = function() {
      if (sessionId === INITIAL_SESSION_ID ||
        apiUrl === '' ||
        Math.floor(Date.now() / 1000) - sessionStartTimestamp >
        SESSION_TIMEOUT_IN_SECONDS) {
        return false;
      }
      return true;
    };

    factory.getSessionId = function() {
      return sessionId;
    };

    factory.getApiUrl = function() {
      return apiUrl;
    };

    factory.authenticate = function(apiUrl, username, password) {
      var deferred = $q.defer();
      this.apiUrl = apiUrl;
      var args = {'username': username,
        'password': password,
        'timeout': SESSION_TIMEOUT_IN_SECONDS};
      jsonrpc.call(apiUrl, INITIAL_SESSION_ID, 'session', 'login', args)
        .then(function(data) {
          sessionId = data.ubus_rpc_session;
          this.sessionStartTimestamp = Math.floor(Date.now() / 1000);
          deferred.resolve(data);
        })
        .catch(function(data) {
          deferred.reject(data);
        });
      return deferred.promise;
    };

    return factory;
  }]);
};

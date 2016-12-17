/**
 * Created by andi on 13.11.16.
 */
'use strict';

module.exports = function(app) {
  app.factory('sessionManager', ['jsonrpc', function(jsonrpc) {
    var INITIAL_SESSION_ID = '00000000000000000000000000000000';
    var SESSION_TIMEOUT_IN_SECONDS = 3600;
    var factory = {};
    factory.sessionId = INITIAL_SESSION_ID;
    factory.apiUrl = '';
    factory.sessionStartTimestamp = 0;

    factory.isAuthenticated = function() {
      if (factory.sessionId === INITIAL_SESSION_ID ||
        factory.apiUrl === '' ||
        Math.floor(Date.now() / 1000) - factory.sessionStartTimestamp >
        SESSION_TIMEOUT_IN_SECONDS) {
        return false;
      }
      return true;
    };

    factory.getSessionId = function() {
      return factory.sessionId;
    };

    factory.getApiUrl = function() {
      return factory.apiUrl;
    };

    factory.authenticate = function(myApiUrl, username, password) {
      factory.apiUrl = myApiUrl;
      var args = {'username': username,
        'password': password,
        'timeout': SESSION_TIMEOUT_IN_SECONDS};
      return jsonrpc.call(factory.apiUrl, INITIAL_SESSION_ID, 'session', 'login', args)
        .then(function(data) {
          factory.sessionId = data.ubus_rpc_session;
          factory.sessionStartTimestamp = Math.floor(Date.now() / 1000);
          return data;
        });
    };

    return factory;
  }]);
};

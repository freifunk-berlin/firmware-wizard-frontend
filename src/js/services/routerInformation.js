/**
 * Created by andi on 13.11.16.
 */
'use strict';

module.exports = function(app) {
  app.factory('routerInformation', ['jsonrpc', 'sessionManager',
    function(jsonrpc, sessionManager) {
    var factory = {};
    factory.routerInformation = {
      system: {},
      wireless: {}
    };

    factory.gatherRouterInformation = function() {
      if (sessionManager.isAuthenticated) {
        jsonrpc.call(sessionManager.getApiUrl(),
          sessionManager.getSessionId(), 'system', 'board', {})
          .then(function(data) {
            console.log(data);
            factory.routerInformation.system = data;
            return data;
          });
        return jsonrpc.call(sessionManager.getApiUrl(),
          sessionManager.getSessionId(), 'network.wireless', 'status', {})
          .then(function(data) {
            factory.routerInformation.wireless = data;
            return data;
          });
      }
    };

    factory.getRouterInformation = function() {
      return factory.routerInformation;
    };

    factory.getSystemInformation = function() {
      return factory.routerInformation.system;
    };

    factory.getWirelessInformation = function() {
      return factory.routerInformation.wireless;
    };

    return factory;

  }]);
};

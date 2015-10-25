'use strict';

module.exports = function(app) {
  app.constant('REGISTER_IPS',{
    service: 'http://localhost:8080/ipservice',
    reserve: '/reserve',
    confirm: '/confirm'
  });
};

'use strict';

module.exports = function(app) {
  app.constant('REGISTER_IPS',{
    service: 'http://prod.com',
    reserve: '/reserve',
    confirm: '/confirm'
  });
};

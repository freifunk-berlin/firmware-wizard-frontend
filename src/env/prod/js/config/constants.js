'use strict';

module.exports = function(app) {
  app.constant('REGISTER_IPS',{
    service: 'http://prod.com',
    methos: 'post',
    reserve: '/reserve',
    confirm: '/confirm'
  });
};

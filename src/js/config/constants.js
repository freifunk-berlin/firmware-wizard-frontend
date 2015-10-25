'use strict';

module.exports = function(app) {
  app.constant('REGISTER_IPS',{
    service: '',
    reserve: '/reserve',
    confirm: '/confirm'
  });
};

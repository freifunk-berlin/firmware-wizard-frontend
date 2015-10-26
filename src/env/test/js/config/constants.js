'use strict';

module.exports = function(app) {
  app.constant('REGISTER_IPS',{
    service: 'ipservice',
    method: 'GET',
    reserve: '/reserve.json',
    confirm: '/confirm.json'
  });
};

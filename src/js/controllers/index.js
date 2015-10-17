'use strict';

module.exports = function(app) {
  require('./wizard')(app);
  require('./dialog')(app);
};

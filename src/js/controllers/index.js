'use strict';

module.exports = function(app) {
  require('./loadconfig')(app);
  require('./wizard')(app);
};

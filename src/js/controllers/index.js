'use strict';

module.exports = function(app) {
  require('./loadconfig')(app);
  require('./authentication')(app);
  require('./wizard')(app);
};

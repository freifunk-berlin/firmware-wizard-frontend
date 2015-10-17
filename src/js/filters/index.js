'use strict';

module.exports = function(app) {
  require('./base64encode')(app);
  require('./range')(app);
};

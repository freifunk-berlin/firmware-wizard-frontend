'use strict';

module.exports = function(app) {
  require('./downloadFile')(app);
  require('./jsonrpc')(app);
};

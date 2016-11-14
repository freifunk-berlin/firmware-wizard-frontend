'use strict';

module.exports = function(app) {
  require('./downloadFile')(app);
  require('./authentication')(app);
  require('./jsonrpc')(app);
};

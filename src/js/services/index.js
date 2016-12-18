'use strict';

module.exports = function(app) {
  require('./downloadFile')(app);
  require('./sessionManager')(app);
  require('./jsonrpc')(app);
};

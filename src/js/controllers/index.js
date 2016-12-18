'use strict';

module.exports = function(app) {
  require('./loadconfig')(app);
  require('./sessionManager')(app);
  require('./statusCtrl')(app);
  require('./wizard')(app);
};

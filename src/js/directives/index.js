'use strict';

module.exports = function(app) {
  require('./compareTo')(app);
  require('./ipAddress')(app);
  require('./fileRequired')(app);
  require('./objectLength')(app);
};

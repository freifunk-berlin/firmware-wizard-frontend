'use strict';

module.exports = function(app) {
  require('./hrefWhitelist')(app);
  require('./translate')(app);
  require('./constants')(app);
};

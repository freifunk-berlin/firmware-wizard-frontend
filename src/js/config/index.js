'use strict';

module.exports = function(app) {
  require('./hrefWhitelist')(app);
  require('./translate')(app);
  require('./constants')(app); /*copy from env dir*/
};

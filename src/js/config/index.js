'use strict';

module.exports = function(app) {
  require('./hrefWhitelist')(app);
  require('./log')(app);
  require('./translate')(app);
};

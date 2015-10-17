'use strict';

var wizard = angular.module('WizardApp', [
  'ui.bootstrap', 'ngAnimate', 'leaflet-directive', 'pascalprecht.translate'
]);

require('./config')(wizard);
require('./controllers')(wizard);
require('./directives')(wizard);
require('./filters')(wizard);
require('./services')(wizard);

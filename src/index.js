// include less
require('./less/index.less');

// official angular modules
import { module } from 'angular';
import ngAnimate from 'angular-animate';    // ngAnimate module
import ngMessages from 'angular-messages';  // ngAnimate module
import ngRoute from 'angular-route';        // ngRoute module
import ngSanitize from 'angular-sanitize';  // ngSanitize module

// other modules
import 'angular-translate';                 // pascalprecht.translate module
import 'angular-translate-loader-static-files';
import 'angular-ui-bootstrap';              // ui.bootstrap
import 'ng-file-upload';                    // ngFileUpload
import 'angular-simple-logger';             // nemLogger (dependency of ui-leaflet)
import 'ui-leaflet';                        // ui-leaflet

import components from './components';

// TODO: move to components
require('!ngtemplate-loader?relativeTo=/src/!html-loader!./shared/loadConfig/loadConfig.html');
require('!ngtemplate-loader?relativeTo=/src/!html-loader!./shared/advancedWifi/advancedWifi.html');
require('!ngtemplate-loader?relativeTo=/src/!html-loader!./shared/basicRouterSetup/basicRouterSetup.html');
require('!ngtemplate-loader?relativeTo=/src/!html-loader!./shared/contactDetails/contactDetails.html');
require('!ngtemplate-loader?relativeTo=/src/!html-loader!./shared/internetSharing/internetSharing.html');
require('!ngtemplate-loader?relativeTo=/src/!html-loader!./shared/ipAddresses/ipAddresses.html');
require('!ngtemplate-loader?relativeTo=/src/!html-loader!./shared/monitoring/monitoring.html');
require('!ngtemplate-loader?relativeTo=/src/!html-loader!./shared/navbar/navbar.html');
require('!ngtemplate-loader?relativeTo=/src/!html-loader!./shared/offlineWarning/offlineWarning.html');
require('!ngtemplate-loader?relativeTo=/src/!html-loader!./shared/olsrInfo/olsrInfo.html');
require('!ngtemplate-loader?relativeTo=/src/!html-loader!./shared/passwordModal/passwordModal.html');
require('!ngtemplate-loader?relativeTo=/src/!html-loader!./shared/routerLocation/routerLocation.html');


var wizard = module('WizardApp', [
  'ui.bootstrap',
  'ngAnimate',
  'ngMessages',
  'ngSanitize',
  'pascalprecht.translate',
  'ngFileUpload',
  'nemLogging',
  'ui-leaflet',
  components.name,
]);


require('./js/config')(wizard);
require('./js/controllers')(wizard);
require('./js/directives')(wizard);
require('./js/filters')(wizard);
require('./js/services')(wizard);

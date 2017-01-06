// official angular modules
import { module } from 'angular';
import 'angular-animate';   // ngAnimate module
import 'angular-messages';  // ngAnimate module
import 'angular-sanitize';  // ngSanitize module

// dependency of ui-leaflet (global variable *facepalm*)
// eslint-disable-next-line import/no-extraneous-dependencies
import 'leaflet';

// other modules
import 'angular-translate';                 // pascalprecht.translate module
import 'angular-translate-loader-static-files';
import 'angular-ui-bootstrap';              // ui.bootstrap
// eslint-disable-next-line import/no-extraneous-dependencies
import 'angular-simple-logger';             // nemLogger (dependency of ui-leaflet)
import 'ui-leaflet';                        // ui-leaflet

// include less
import './less/index.less';

import components from './components';
import config from './config';
import directives from './directives';
import filters from './filters';
import services from './services';

module('WizardApp', [
  'ui.bootstrap',
  'ngAnimate',
  'ngMessages',
  'ngSanitize',
  'pascalprecht.translate',
  'nemLogging',
  'ui-leaflet',
  components.name,
  config.name,
  directives.name,
  filters.name,
  services.name,
]);

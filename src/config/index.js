import { module } from 'angular';

import hrefWhitelist from './href-whitelist';
import log from './log';
import translate from './translate';
import urlRouter from './url-router';

export default module('app.config', [
  hrefWhitelist.name,
  log.name,
  translate.name,
  urlRouter.name,
]);

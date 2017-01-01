import { module } from 'angular';

import hrefWhitelist from './hrefWhitelist';
import log from './log';
import translate from './translate';

export default module('app.config', [
  hrefWhitelist.name,
  log.name,
  translate.name,
]);

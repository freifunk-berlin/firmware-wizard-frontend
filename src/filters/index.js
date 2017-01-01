import { module } from 'angular';

import base64encode from './base64encode';
import range from './range';

export default module('app.filters', [
  base64encode.name,
  range.name,
]);

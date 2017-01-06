import { module } from 'angular';

import base64encode from './base64encode';
import fieldValid from './field-valid';
import objectLength from './object-length';
import range from './range';

export default module('app.filters', [
  base64encode.name,
  fieldValid.name,
  objectLength.name,
  range.name,
]);

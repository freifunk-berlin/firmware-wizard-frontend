import { module } from 'angular';

import base64encode from './base64encode';
import fieldValid from './field-valid';
import objectLength from './object-length';
import range from './range';
import secondToDatetime from './seconds-to-datetime';
import byteFormat from './byte-format';

export default module('app.filters', [
  base64encode.name,
  fieldValid.name,
  objectLength.name,
  range.name,
  secondToDatetime.name,
  byteFormat.name,
]);

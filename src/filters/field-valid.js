import { module } from 'angular';

export default module('app.filters.field-valid', [])
  .filter('fieldSuccess', () => input => input && input.$dirty && input.$valid)
  .filter('fieldError', () => input => input && input.$dirty &&
    input.$invalid && input.$error);

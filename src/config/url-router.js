import { module } from 'angular';

export default module('app.config.url-router', [])
  .config($urlRouterProvider => {
    'ngInject';
    // redirect empty url to /
    $urlRouterProvider.when('', '/');
  });

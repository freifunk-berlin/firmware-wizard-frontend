import { module } from 'angular';
import uiRouter from '@uirouter/angularjs';

export default module('app.components.home', [uiRouter])
  .config(($stateProvider) => {
    'ngInject';

    $stateProvider.state({
      component: 'home',
      name: 'home',
      url: '/',
    });
  })
  .component('home', {
    template: require('./home.html'),
  });

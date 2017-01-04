// required validation for input type file is not supported yet
// see: https://github.com/angular/angular.js/issues/1375
// see: https://github.com/angular/angular.js/pull/8987

import { module } from 'angular';

export default module('app.directives.file-required', [])
  .directive('fileValid', () => ({
    require: 'ngModel',
    scope: {
      required: '=ngRequired',
    },
    link: (scope, element, attributes, ngModel) => {
      // handle element change
      element.bind('change', () => {
        scope.$apply(() => {
          ngModel.$setViewValue(element.val());
          ngModel.$render();
        });
      });
    },
  }));

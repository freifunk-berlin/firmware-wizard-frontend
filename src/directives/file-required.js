//required validation for input type file is not supported yet
//see: https://github.com/angular/angular.js/issues/1375
//see: https://github.com/angular/angular.js/pull/8987

import { module } from 'angular';

export default module('app.directives.file-required', [])
  .directive('fileValid', () => {
    return {
      require: 'ngModel',
      scope: {
        required: '=ngRequired'
      },
      link: function(scope, element, attributes, ngModel) {

        //handle element change
        element.bind('change',function() {
          scope.$apply(function() {
            ngModel.$setViewValue(element.val());
            ngModel.$render();
          });
        });

      }
    };
  });

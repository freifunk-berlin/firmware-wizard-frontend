//required validation for input type file is not supported yet
//see: https://github.com/angular/angular.js/issues/1375
//see: https://github.com/angular/angular.js/pull/8987

'use strict';

module.exports = function(app) {
  app.directive('fileValid', function() {
    return {
      require: 'ngModel',
      scope: {
        required: '=ngRequired'
      },
      link: function(scope, element, attributes, ngModel) {
        console.log(scope.required);
        scope.$watch('required', function(newValue, oldValue) {
          console.log('required changed');
        });

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
};

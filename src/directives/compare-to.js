import { module } from 'angular';

export default module('app.directives.compare-to', [])
  .directive('compareTo', () => {
    // http://odetocode.com/blogs/scott/archive/2014/10/13/confirm-password-validation-in-angularjs.aspx
    return {
      require: 'ngModel',
      scope: {
        otherModelValue: '=compareTo'
      },
      link: function(scope, element, attributes, ngModel) {

        ngModel.$validators.compareTo = function(modelValue) {
          return modelValue == scope.otherModelValue;
        };

        scope.$watch('otherModelValue', function() {
          ngModel.$validate();
        });
      }
    };
  });

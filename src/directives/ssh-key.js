import { module } from 'angular';
import verifySshKey from 'ssh-pub-key-validation';

export default module('app.directives.ssh-key', [])
  .directive('verifysshkey', () => {
    return {
      require: 'ngModel',
      link: function(scope, element, attr, ctrl) {
        ctrl.$validators.verifysshkey = function(keys) {
          var validKeys = true;
          angular.forEach(keys, function(key) {
            if (!verifySshKey.isKeyValid(key)) {
              validKeys = false;
            }
          });
          return validKeys;
        };
      }
    };
  });

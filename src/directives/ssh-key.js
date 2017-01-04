import { module } from 'angular';
import verifySshKey from 'ssh-pub-key-validation';

export default module('app.directives.ssh-key', [])
  .directive('verifysshkey', () => ({
    require: 'ngModel',
    link: (scope, element, attr, ctrl) => {
      ctrl.$validators.verifysshkey = (keys) => {
        let validKeys = true;
        if (!keys) return true;
        keys.forEach((key) => {
          if (!verifySshKey.isKeyValid(key)) {
            validKeys = false;
          }
        });
        return validKeys;
      };
    },
  }));

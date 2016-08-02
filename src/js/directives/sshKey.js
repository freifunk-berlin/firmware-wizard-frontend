'use strict';

var verifySshKey = require('ssh-pub-key-validation');

module.exports = function(app) {
    app.directive('verifysshkey', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ctrl) {
                ctrl.$validators.verifysshkey = function(keys) {
                    var validKeys = true;
                    angular.forEach(keys, function(key) {
                        if (!verifySshKey.isKeyValid(key)) {
                            validKeys = false;
                        }
                    });
                    return validKeys;
                }
            }
        }
    });
}
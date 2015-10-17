'use strict';

module.exports = function(app) {
  app.factory('downloadFile',
    ['$document', 'base64encodeFilter', function($document, base64encode) {
      return function(filename, data, mimeType, base64, charset) {
        var href = 'data:' + mimeType +
          (charset ? ';charset:' + charset : '') +
          (base64 ? ';base64' : '') +
          ',' + (base64 ? base64encode(data) : data);

        var element = angular.element('<a>dummy</a>');
        element.attr('href', href);
        element.attr('download', filename);
        element.css('display', 'none');

        var body = $document.find('body').eq(0);
        body.append(element);

        element[0].click();

        element.detach();
      };
    }]
  );
};

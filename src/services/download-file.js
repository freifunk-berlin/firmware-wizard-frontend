import { module } from 'angular';

export default module('app.services.download-file', [])
  .service('downloadFile', class DownloadFileService {
    constructor($document, base64encodeFilter) {
      'ngInject';
      this.$document = $document;
      this.base64encodeFilter = base64encodeFilter;
    }

    download(filename, data, mimeType, base64, charset) {
      const href = 'data:' + mimeType +
        (charset ? ';charset:' + charset : '') +
        (base64 ? ';base64' : '') +
        ',' + (base64 ? this.base64encodeFilter(data) : data);

      const element = angular.element('<a>dummy</a>');
      element.attr('href', href);
      element.attr('download', filename);
      element.css('display', 'none');

      const body = this.$document.find('body').eq(0);
      body.append(element);

      element[0].click();

      element.detach();
    }
  });

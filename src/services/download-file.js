import { element, module } from 'angular';

export default module('app.services.download-file', [])
  .service('downloadFile', class DownloadFileService {
    constructor($document, base64encodeFilter) {
      'ngInject';

      this.$document = $document;
      this.base64encodeFilter = base64encodeFilter;
    }

    download(filename, data, mimeType, base64, charset) {
      const newCharset = (charset ? `;charset=${charset}` : '');
      const newBase64 = (base64 ? ';base64' : '');
      const newData = (base64 ? this.base64encodeFilter(data) : data);
      const href = `data:${mimeType}${newCharset}${newBase64},${newData}`;

      const el = element('<a>dummy</a>');
      el.attr('href', href);
      el.attr('download', filename);
      el.css('display', 'none');

      const body = this.$document.find('body').eq(0);
      body.append(el);

      el[0].click();

      el.detach();
    }
  });

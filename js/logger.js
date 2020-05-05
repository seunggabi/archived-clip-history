window.$clipHistory = window.$clipHistory || {};

window.$clipHistory.logger = (function () {
  'use strict';

  const { history } = window.$clipHistory;

  function logClipboardRead(fn) {
    try {
      window.document.hasFocus() && navigator.clipboard.readText().then(text => {
        if(text === '') {
          _readImage(fn);
        }

        text && history.push([text]).then(() => {
          fn && fn();
        });
      }).catch(

      );
    } catch(e) {
    }
  }

  function _readImage(fn) {
    try {
      navigator.clipboard.read().then(clipboardItems => {
        for (const clipboardItem of clipboardItems) {
          for (const type of clipboardItem.types) {
            clipboardItem.getType(type).then(blob => {
              const isImage = blob.type.match(/^image\/.*/g).length > 0;
              blob.arrayBuffer().then(buffer => {
                buffer = Array.from(new Uint8Array(buffer))

                const o = {}
                o.type = blob.type;
                o.value = buffer;
                isImage && history.push([JSON.stringify(o)]).then(() => {
                  fn && fn();
                });
              });
            });
          }
        }
      });
    } catch (e) {
    }
  }

  return {
    logClipboardRead
  };
})();

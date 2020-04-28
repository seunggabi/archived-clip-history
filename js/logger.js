window.$clipHistory = window.$clipHistory || {};

window.$clipHistory.logger = (function () {
  'use strict';

  const { history } = window.$clipHistory;

  function logClipboardRead(fn) {
    try {
      window.document.hasFocus() && navigator.clipboard.readText().then(text => {
        history.push([text]).then(() => {
          fn && fn();
        });
      }).catch(

      );
    } catch(e) {

    }
  }

  return {
    logClipboardRead
  };
})();

window.$clipHistory = window.$clipHistory || {};

window.$clipHistory.logger = (function () {
  'use strict';

  const { history } = window.$clipHistory;

  function logClipboardRead() {
    try {
      window.document.hasFocus() && navigator.clipboard.readText().then(text => {
        history.push([text]);
      }).catch(

      );
    } catch(e) {

    }
  }

  return {
    logClipboardRead
  };
})();

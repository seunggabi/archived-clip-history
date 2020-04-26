window.$clipHistory = window.$clipHistory || {};

window.$clipHistory.logger = (function () {
  'use strict';

  const { history } = window.$clipHistory;

  function logClipboardRead() {
    try {
      navigator.clipboard.readText().then(text => {
        history.push([text]);
      });
    } catch (e) {
    }
  }

  return {
    logClipboardRead
  };
})();

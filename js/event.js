(function () {
  'use strict';
  const { history, logger } = window.$clipHistory;

  setInterval(() => {
    logger.logClipboardRead();

    history.list().then(t =>
      console.log(t)
    );
  }, 1000);
})();

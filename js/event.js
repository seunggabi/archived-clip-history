(function () {
  'use strict';
  const { logger, WATCH_INTERVAL_TIME } = window.$clipHistory;

  setInterval(() => {
    logger.logClipboardRead();
  }, WATCH_INTERVAL_TIME);
})();

(function () {
  'use strict';
  const { history, logger, WATCH_INTERVAL_TIME } = window.$clipHistory;

  setInterval(() => {
    logger.logClipboardRead();

    history.list().then(t =>
      console.log(t)
    );
  }, WATCH_INTERVAL_TIME);
})();

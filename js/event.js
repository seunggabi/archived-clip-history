(function () {
  const { logger } = window.$clipHistory;

  setInterval(() => {
    logger.logClipboardRead();
  }, window.$clipHistory.common.CONST.WATCH_INTERVAL_TIME);
})();

load = () => {
  _load();

  setInterval(() => {
    _load();
  }, window.$clipHistory.WATCH_INTERVAL_TIME * 1.5)
};

_renderRemoveAll = () => {
  const $e = $(window.$clipHistory.common.doms.button);

  $e.text('Remove All');
  $e.click(() => {
    if(confirm('it\'s okay?')) {
      window.$clipHistory.history.removeAll();
    }

    setTimeout(_load, 1);
  })

  return $e;
}

_renderX = (i) => {
  const $e = $(window.$clipHistory.common.doms.button);

  $e.text('x');
  $e.click(() => {
    if(confirm('it\'s okay?')) {
      window.$clipHistory.history.remove(i)
    }

    setTimeout(_load, 1);
  })

  return $e;
}

_renderCopy = (i) => {
  const $e = $(window.$clipHistory.common.doms.button);

  $e.text('copy');
  $e.click(() => {
    window.$clipHistory.history.load(i)
    setTimeout(_load, 1);
  })

  return $e;
}

_load = () => {
  const { doms } = window.$clipHistory.common;
  const { history } = window.$clipHistory;

  const $parents = $("#body");
  $parents.html('');

  const $removeAll = _renderRemoveAll(i);
  $parents.append($removeAll);

  history.list().then((list) => {
    list.forEach((t, i) => {
      const $s = $(doms.span);
      $s.text(t);

      const $x = _renderX(i);
      const $copy = _renderCopy(i);
      const $d = $(doms.div);
      $d.append($x);
      $d.append($copy);
      $d.append($s);

      $parents.append($d);
    });
  })
}

bindEvent = () => {};

init = () => {
  load();
  bindEvent();
};


window.addEventListener("load", init);

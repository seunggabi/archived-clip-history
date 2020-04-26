load = () => {
  _load();

  setInterval(() => {
    _load();
  }, window.$clipHistory.WATCH_INTERVAL_TIME * 1.5)
};

_renderX = (i) => {
  const $x = $(window.$clipHistory.common.doms.button);

  $x.text('x');
  $x.click(() => {
    if(confirm('it\'s okay?')) {
      window.$clipHistory.history.remove(i)
    }

    setTimeout(_load, 1);
  })

  return $x;
}

_renderCopy = (i) => {
  const $copy = $(window.$clipHistory.common.doms.button);

  $copy.text('copy');
  $copy.click(() => {
    window.$clipHistory.history.load(i)
    setTimeout(_load, 1);
  })

  return $copy;
}

_load = () => {
  const { doms } = window.$clipHistory.common;
  const { history } = window.$clipHistory;

  const $parents = $("#body");
  $parents.html('');
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

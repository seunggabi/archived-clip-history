

load = () => {
  _load();

  setInterval(() => {
    _load();
  }, window.$clipHistory.common.CONST.REFRESH_INTERVAL_TIME)
};

_renderRemoveAll = () => {
  const $e = $(window.$clipHistory.common.doms.button);

  $e.text('Remove All');
  $e.click(() => {
    if(confirm('OK?')) {
      window.$clipHistory.history.removeAll();
    }

    setTimeout(_load, window.$clipHistory.common.CONST.TIMEOUT);
  })

  return $e;
}

_refresh = () => {
  const $e = $(window.$clipHistory.common.doms.button);

  $e.text('Force Refresh (auto refresh every 30s)');
  $e.click(() => {
    setTimeout(_load, window.$clipHistory.common.CONST.TIMEOUT);
  })

  return $e;
}

_countDown = () => {
  const $e = $(window.$clipHistory.common.doms.span);
  $e.prop('id', 'timer');
  $e.text(
      window.$clipHistory.common.CONST.REFRESH_INTERVAL_TIME
      /
      window.$clipHistory.common.CONST.WATCH_INTERVAL_TIME);
  $e.addClass('red')

  clearInterval(window.$clipHistory.interval);
  window.$clipHistory.interval = setInterval(() => {
    const $timer = $("#timer");
    let time = +$timer.text()

    time > 0 && $timer.text(time-1);
  }, window.$clipHistory.common.CONST.WATCH_INTERVAL_TIME)

  return $e;
}

_renderX = (i) => {
  const $e = $(window.$clipHistory.common.doms.button);

  $e.text('x');
  $e.click(() => {
    if(confirm('OK?')) {
      window.$clipHistory.history.remove(i)
    }

    setTimeout(_load, window.$clipHistory.common.CONST.TIMEOUT);
  })

  return $e;
}

_renderCopy = (i) => {
  const $e = $(window.$clipHistory.common.doms.button);

  $e.text('copy');
  $e.click(() => {
    window.$clipHistory.history.load(i).then(() => {
      setTimeout(() => {
        window.$clipHistory.logger.logClipboardRead(_load);
      }, window.$clipHistory.common.CONST.TIMEOUT);
    })
  })

  return $e;
}

_convertHyperLink = (value) => {
  if(value instanceof Object) {
    return value;
  }

  return value
      .split(' ')
      .map(t => {
        if (/https?:/.test(t)) {
          return `<a href=${t} target="_blank">${t}</a>&nbsp;`;
        }
        return `${t} `;
      });
}

_drawImage = (data) => {
  const { doms } = window.$clipHistory.common;
  const $img = $(doms.img);

  const buffer = JSON.parse(data).value;
  const src = "data:image/png;base64," + btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)));
  $img.prop('src',src);

  return $img;
}

_load = () => {
  const { doms } = window.$clipHistory.common;
  const { history } = window.$clipHistory;

  const $parents = $("#body");
  $parents.html('');

  const $tool = $(doms.div);
  $tool.prop('id', 'tool');

  const $removeAll = _renderRemoveAll();
  $tool.append($removeAll);
  const $refresh = _refresh();
  $tool.append($refresh);
  const $countDown = _countDown();
  $tool.append(' (');
  $tool.append($countDown);
  $tool.append(')');
  $parents.append($tool);

  history.list().then((list) => {
    list.forEach((t, i) => {
      const $pre = $(doms.pre);

      try {
        if(/^image\/.*/g.test(JSON.parse(t).type)) {
          $pre.html(_drawImage(t))
        } else {
          throw 'NOT IMAGE';
        }
      } catch (e) {
        $pre.html(_convertHyperLink(t));
      }

      const $x = _renderX(i);
      const $copy = _renderCopy(i);

      const $d = $(doms.div);
      $d.addClass('box')
      $d.append($x);
      $d.append($copy);
      $d.append(' ');
      $d.append($pre);

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

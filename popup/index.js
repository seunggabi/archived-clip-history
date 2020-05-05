load = () => {
  _load();

  setInterval(() => {
    _load();
  }, window.$clipHistory.REFRESH_INTERVAL_TIME)
};

_renderRemoveAll = () => {
  const $e = $(window.$clipHistory.common.doms.button);

  $e.text('Remove All');
  $e.click(() => {
    if(confirm('OK?')) {
      window.$clipHistory.history.removeAll();
    }

    setTimeout(_load, 1);
  })

  return $e;
}

_refresh = () => {
  const $e = $(window.$clipHistory.common.doms.button);

  $e.text('Force Refresh (auto refresh every 30s)');
  $e.click(() => {
    setTimeout(_load, 1);
  })

  return $e;
}

_countDown = () => {
  const $e = $(window.$clipHistory.common.doms.span);
  $e.prop('id', 'timer');
  $e.text(window.$clipHistory.REFRESH_INTERVAL_TIME/1000);
  $e.addClass('red')

  clearInterval(window.$clipHistory.interval);
  window.$clipHistory.interval = setInterval(() => {
    const $timer = $("#timer");
    let time = +$timer.text()

    time > 0 && $timer.text(time-1);
  }, 1000)

  return $e;
}

_renderX = (i) => {
  const $e = $(window.$clipHistory.common.doms.button);

  $e.text('x');
  $e.click(() => {
    if(confirm('OK?')) {
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
    window.$clipHistory.history.load(i).then(() => {
      window.$clipHistory.logger.logClipboardRead(_load);
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
      const $s = $(doms.span);

      try {
        if(JSON.parse(t).type.match(/^image\/.*/g).length > 0) {
          $s.html(_drawImage(t))
        } else {
          throw 'NOT IMAGE';
        }
      } catch (e) {
        $s.html(_convertHyperLink(t));
      }

      const $x = _renderX(i);
      const $copy = _renderCopy(i);

      const $d = $(doms.div);
      $d.addClass('box')
      $d.append($x);
      $d.append($copy);
      $d.append(' ');
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

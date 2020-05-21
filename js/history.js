window.$clipHistory = window.$clipHistory || {};

window.$clipHistory.history = (function () {
  let name = getName();
  let type = getType();

  function getName() {
    return chrome.runtime.getManifest().name.toUpperCase();
  }

  function getType() {
    return 'local';
  }

  function getStorage() {
    return new Promise((resolve) => {
      try {
        chrome.storage[type].get(name, (storage = {}) => {
          resolve(storage[name] || {});
        });
      } catch(e) {
        resolve();
      }
    });
  }

  function setStorage(data) {
    return new Promise((resolve) => {
      let obj = {};
      obj[name] = data;

      chrome.storage[type].set(obj, () => {
        resolve();
      });
    });
  }

  function push(list) {
    return new Promise((resolve) => {
      getStorage().then((storage = {}) => {
        _.remove(list, i => i === ' ');

        let history = list.concat(storage.history || []);
        let uniq = _.uniqBy(history, e => JSON.stringify(e));

        setStorage({
          history: uniq
        }).then(() => {
          resolve(uniq.length);
        });
      });
    });
  }

  function removeAll() {
    copyText(' ');

    setStorage({
      history: []
    });
  }

  function remove(index) {
    return new Promise((resolve) => {
      getStorage().then((storage = {}) => {
        let history = storage.history || [];
        _.remove(history, i => history[index] === i);

        if(index === 0) {
          copyText(' ')
        }

        setStorage({
          history
        }).then(() => {
          resolve(history.length);
        });
      });
    });
  }

  function load(index) {
    return new Promise((resolve) => {
      getStorage().then((storage = {}) => {
        let history = storage.history || [];
        const target = history[index];

        try {
          if(/^image\/.*/g.test(JSON.parse(target).type)) {
            copyImage(target);
            resolve(target);
            return;

          } else {
            throw 'NOT IMAGE';
          }
        } catch (e) {
          copyText(target);
        }

        resolve(target)
      });
    });
  }

  function copyText(target) {
    const el = document.createElement('textarea');
    el.value = target;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  function copyImage(target) {
    const { value } = JSON.parse(target);

    // FIXME: image/gif not working ...; only image/png ...;
    let blob = new Blob([new Uint8Array(value).buffer],  { type: 'image/jpeg' })
    let item = new ClipboardItem({ [blob.type] : blob });

    navigator.clipboard.write([item]).catch(() => {
      blob = new Blob([new Uint8Array(value).buffer],  { type: 'image/png' })
      item = new ClipboardItem({ [blob.type] : blob });
      navigator.clipboard.write([item]);
    }).catch(() => {
      blob = new Blob([new Uint8Array(value).buffer],  { type: 'image/jpeg' })
      item = new ClipboardItem({ [blob.type] : blob });
      navigator.clipboard.write([item]);
    });
  }

  function list() {
    return new Promise((resolve) => {
      getStorage().then((storage = {}) => {
        let l = (storage.history || []);
        resolve(l);
      });
    });
  }

  return {
    list,
    push,
    remove,
    removeAll,
    load
  };
})();

window.$clipHistory = window.$clipHistory || {
  WATCH_INTERVAL_TIME: 1000,
  REFRESH_INTERVAL_TIME: 30000,
  interval: undefined
};

window.$clipHistory.history = (function () {
  'use strict';

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
        _.remove(list, i => i === ' ')

        let history = list.concat(storage.history || []);
        let uniq = _.uniq(history);

        setStorage({
          history: uniq
        }).then(() => {
          resolve(uniq.length);
        });
      });
    });
  }

  function removeAll() {
    copy(' ');

    setStorage({
      history: []
    }).then(() => {
      resolve(0);
    });
  }

  function remove(index) {
    return new Promise((resolve) => {
      getStorage().then((storage = {}) => {
        let history = storage.history || [];
        _.remove(history, i => history[index] === i);

        console.log(index);
        if(index === 0) {
          copy(' ')
        }

        setStorage({
          history: history
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

        copy(target);

        resolve(target)
      });
    });
  }

  function copy(target) {
    const el = document.createElement('textarea');
    el.value = target;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
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

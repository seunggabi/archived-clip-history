window.$clipHistory = window.$clipHistory || {};

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
      chrome.storage[type].get(name, (storage) => {
        resolve(storage[name] || {});
      });
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
      getStorage().then((storage) => {
        let history = (storage.history || []).concat(list);
        let uniqueHistory = [];

        history.forEach(item => {
          let index = uniqueHistory.findIndex((i) => {
            return (i === item);
          });

          if (index > -1) {
            uniqueHistory.splice(index, 1);
          }

          if (item) {
            uniqueHistory.push(item);
          }
        });

        setStorage({
          history: uniqueHistory
        }).then(() => {
          resolve(history.length);
        });
      });
    });
  }

  function remove(item) {
    return new Promise((resolve) => {
      getStorage().then((storage) => {
        let history = storage.history || [];
        let targetIndex = history.findIndex((i) => {
          return (i === item);
        });

        if (targetIndex > -1) {
          history.splice(targetIndex, 1);
          setStorage({
            history: history
          }).then(() => {
            resolve(history.length);
          });
        }
      });
    });
  }

  function list() {
    return new Promise((resolve) => {
      getStorage().then((storage = {}) => {
        let l = (storage.history || []).reverse();
        resolve(l);
      });
    });
  }

  return {
    list,
    push,
    remove
  };
})();

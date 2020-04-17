window.$clipHistory = window.$clipHistory || {};

window.$clipHistory.common = {};
window.$clipHistory.common.data = {
  review: {
    className: "red bold",
    urls: [
      // {
      //   name: "Chrome",
      //   url: "",
      // },
      // {
      //   name: "Whale",
      //   url: "",
      // },
      {
        name: "Toonation",
        url: "https://toon.at/donate/637225213338784448",
      }
    ]
  },
  project: [
    {
      name: "Smart Boook",
      urls: [
        {
          name: "click",
          url: "http://smartboook.com/",
        }
      ],
      className: "bold",
      style: "",
    },
    {
      name: "Auto Skip",
      urls: [
        {
          name: "Whale",
          url: "https://store.whale.naver.com/detail/elgcmjohjpjgmogomciohcdgofjmddaj",
        }
      ],
      className: "bold",
      style: "",
    },
    {
      name: "Auto Refresh",
      urls: [
        {
          name: "Chrome",
          url: "https://chrome.google.com/webstore/detail/autorefresh/kpblfhpdgghcabcfkndaicjhkppckdfk",
        },
        {
          name: "Whale",
          url: "https://store.whale.naver.com/detail/dmfiihebfllgebodghhgbldipmpiehem",
        }
      ],
      className: "bold",
      style: "",
    },
    {
      name: "Instagram Follower Count",
      urls: [
        {
          name: "click",
          url: "https://seunggabi.tistory.com/entry/insta-follwer-%EC%9D%B8%EC%8A%A4%ED%83%80%EA%B7%B8%EB%9E%A8-%ED%8C%94%EB%A1%9C%EC%9B%8C-%EC%88%98-%EC%B9%B4%EC%9A%B4%ED%8A%B8-%EB%B4%87",
        }
      ],
      className: "bold",
      style: "",
    },
  ]
};

window.$clipHistory.common.doms = {
  link_wrapper: '<div class="link-wrapper"></div>',
  a: '<a href="#" target="_blank" class="padding-left-3"></a>',
  li: '<li>'
};



/* reference: https://www.w3schools.com/js/js_cookies.asp */
window.$clipHistory.common.getCookie = (cname) => {
  const name = cname + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};



window.$clipHistory.common.a = (link, $parents) => {
  const { doms } = window.$clipHistory.common;

  link.urls && link.urls.forEach(url => {
    let $a = $(doms.a);
    $a.prop("href", url.url);
    $a.text(`(${url.name})`);
    $a.addClass(link.className);

    $parents.append($a);
  });

  if(link instanceof Array) {
    link.forEach(l => {
      let $a = $(doms.a);
      $a.prop("href", l.url);
      $a.text(`${l.name}`);
      $a.addClass(l.className);

      let $li = $(doms.li);
      $li.append($a);
      $parents.append($li);
    })
  }
};

window.$clipHistory.common.r = () => {
  const { a, data, doms } = window.$clipHistory.common;

  a(data.review, $("#review"));

  data.project.forEach(link => {
    let $wrapper = $(doms.li);
    $wrapper.text(link.name);

    a(link, $wrapper);

    $("#project").append($wrapper);
  });
};

function i() {
  window.$clipHistory.common.r()
}

window.addEventListener("load", i);

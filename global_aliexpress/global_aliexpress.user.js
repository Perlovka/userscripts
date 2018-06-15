// ==UserScript==
// @name Global Aliexpress
// @namespace Perlovka/userscripts
// @homepageURL https://github.com/Perlovka/userscripts
// @version 1.0.3
// @downloadURL https://github.com/Perlovka/userscripts/raw/master/global_aliexpress/global_aliexpress.user.js
// @updateURL https://github.com/Perlovka/userscripts/raw/master/global_aliexpress/global_aliexpress.user.js
// @match *://*
// @include *://*
// @run-at document-end
// @grant GM_xmlhttpRequest
// ==/UserScript==

function stripUrl(url) {
  return url.split('?')[0];
}

function changeUrl(url) {
  return url.replace('ru.aliexpress.com', 'www.aliexpress.com');
}

function unRefer(url, link_id) {
    let result = GM_xmlhttpRequest ( {
      method: "GET",
      url:  url,
      onload: function (res) {
//        console.log('Referral link found: ' + url + ' ->\n\n' + res.finalUrl + ' ->\n\n' + changeUrl(res.finalUrl));
        links.snapshotItem(link_id).href = changeUrl(res.finalUrl);
      },
      onerror: function (res) {console.log(res.statusText);}
    } );
}

var links = document.evaluate("//a[contains(@href, 'ru.aliexpress.com') or contains(@href, 'ali.pub')]",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);

for (var i=0; i<links.snapshotLength; i++) {
  let link = links.snapshotItem(i);
  let url = link.href;

  if (url.match('ru.aliexpress.com')) {
    link.href = changeUrl(url);
    link.innerHTML = stripUrl(url);
//    console.log('Direct link found: ' + url + ' -> ' + stripUrl(url));
  }
  else {
    unRefer(url, i);
  }

}

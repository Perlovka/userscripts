// ==UserScript==
// @name Spinningist: disable u.to
// @namespace Perlovka/userscripts
// @homepageURL https://github.com/Perlovka/userscripts
// @version 1.0.0
// @downloadURL https://github.com/Perlovka/userscripts/raw/master/spinningist.com/no_uto.user.js
// @updateURL https://github.com/Perlovka/userscripts/raw/master/spinningist.com/no_uto.user.js
// @match *://*.spinningist.com/*
// @include *://*.spinningist.com/*
// @run-at document-end
// @grant GM_xmlhttpRequest
// ==/UserScript==

var links = document.evaluate("//a[contains(@href, '\/u.to\/')]",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);

for (var i=0; i<links.snapshotLength; i++) {
    let link = links.snapshotItem(i);
    if (link.title) {
        link.href = link.title;
    }
}

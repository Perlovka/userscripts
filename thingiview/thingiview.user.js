// ==UserScript==
// @name Thingiview
// @namespace Perlovka/userscripts
// @homepageURL https://github.com/Perlovka/userscripts
// @downloadURL https://github.com/Perlovka/userscripts/raw/master/thingiview/thingiview.user.js
// @updateURL https://github.com/Perlovka/userscripts/raw/master/thingiview/thingiview.user.js
// @version 1.0.2
// @match *://*/*
// @include *://*/*
// @run-at document-end
// @grant GM_xmlhttpRequest
// ==/UserScript==

var css = 'a.thv_link:hover > img {display: block !important; position: absolute; bottom: 5px;}';
var pHeight = 300;
var style = document.createElement('style');
var timeout = null;

if (style.styleSheet) {
    style.styleSheet.cssText = css;
} else {
    style.appendChild(document.createTextNode(css));
}

//document.getElementsByTagName('head')[0].appendChild(style);

function parseResponseHTML (res, el) {
    var parser      = new DOMParser ();
    var responseDoc = parser.parseFromString (res.responseText, "text/html");
    let purl = responseDoc.querySelectorAll('meta[property="og:image"]')[0].getAttribute('content');
  
    let link = document.createElement('img');
    link.setAttribute('src', purl);
    link.setAttribute('height', pHeight+'px');
    link.setAttribute('class', 'thv_img');
    el.className += ' thv_link';
    el.appendChild(link);
}

function loadPreview(el){
  if (! el.target.getElementsByClassName('thv_img').length)  {
    console.log('Getting preview for ' + el.target.href)
    let result = GM_xmlhttpRequest ( {
      method: "GET",
      url:  el.target.href,
      onload: function (res) {
        parseResponseHTML(res, el.target);
      },
      onerror: function (res) {console.log(res.statusText);}
    });
  }
  else {
    showPreview(el);
  }
}

function showPreview(el) {
//  console.log('Show preview for ' + el.target.href)
  let elements = el.target.getElementsByClassName('thv_img');
  if (elements.length)  {
      elements[0].style.display = 'block';
  }
}

function hidePreview(el) {
  console.log('Hide preview for ' + el.target.href)
  let elements = el.target.getElementsByClassName('thv_img');
  if (elements.length)  {
      elements[0].style.display = 'none';
  }
}

function getPreview(el) {
  if (el.target.nodeName == "A") {
     loadPreview(el);
  }
}

var links = document.evaluate("//a[contains(@href, 'thingiverse.com/thing:')]",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);

for (var i=0; i<links.snapshotLength; i++) {
  let link = links.snapshotItem(i);
  link.addEventListener('mouseover', getPreview);
  link.addEventListener('mouseout', hidePreview);
}

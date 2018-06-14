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

var css = '.thv_tip {visibility: hidden; opacity: 0; transition: opacity 0.5s;     position: absolute;    z-index: 1;     top: 125%;    left: 50%; border: 5px solid #ccc; border-radius: 5px; }';
var pHeight = 300;
var style = document.createElement('style');
var timeout = null;

if (style.styleSheet) {
    style.styleSheet.cssText = css;
} else {
    style.appendChild(document.createTextNode(css));
}

document.getElementsByTagName('head')[0].appendChild(style);

function attachTooltip(el, src) {
  
    let tooltip = document.createElement('span');
    let thumb = document.createElement('img');
  
    thumb.setAttribute('src', src);
    thumb.setAttribute('height', pHeight+'px');
    tooltip.setAttribute('class', 'thv_tip');
    el.style.position = 'relative';
    el.className += ' thv_link';
    el.appendChild(tooltip);
    tooltip.appendChild(thumb);

    showTooltip(el);
}

function loadPreview(el){
  if (! el.target.getElementsByClassName('thv_tip').length)  {
    console.log('Getting preview for ' + el.target.href)
    let result = GM_xmlhttpRequest ( {
      method: "GET",
      url:  el.target.href,
      onload: function (res) {
        let parser      = new DOMParser ();
        let responseDoc = parser.parseFromString (res.responseText, "text/html");
        let purl = responseDoc.querySelectorAll('meta[property="og:image"]')[0].getAttribute('content');
        attachTooltip(el.target, purl);
      },
      onerror: function (res) {console.log(res.statusText);}
    });
  }
  else {
    showTooltip(el.target);
  }
}

function showTooltip(el) {
//  console.log('Show preview for ' + el.target.href)
  let elements = el.getElementsByClassName('thv_tip');
  if (elements.length)  {
      elements[0].style.visibility = 'visible';
      elements[0].style.opacity = 1;
  }
}

function hideTootltip(el) {
//  console.log('Hide preview for ' + el.target.href)
  let elements = el.target.getElementsByClassName('thv_tip');
  if (elements.length)  {
      elements[0].style.visibility = 'hidden';
      elements[0].style.opacity = 0;
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
  link.addEventListener('mouseout', hideTooltip);
}

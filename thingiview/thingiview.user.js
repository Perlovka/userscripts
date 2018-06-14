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

var tpHeight = 300;
var tpOffset = 15;
var tpTimeout = 300;
var timeoutID = null;
var css = document.createElement('style');
css.type = "text/css";
css.innerHTML = `
  .thv_tip {
    position: fixed;
    z-index: 100;
    display: block;
    height: `+ tpHeight +`px;
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.3s;
    border: 5px solid #ddd;
    border-radius: 5px;
    background-color: red;
    }
`;
document.head.appendChild(css);

function getPosition(ev) {
//  let rect = ev.target.getBoundingClientRect();
  var tpX, tpY;
/*     if ( (ev.clientX + tpHeight + tpOffset) > window.innerHeight ) {
         tpY = ev.clientY - tpHeight - tpOffset*2 + 'px';
     }
       else {
         tpY = ev.clientY + tpOffset + 'px';
     }
*/

  if ( (ev.clientY + tpHeight + tpOffset) > window.innerHeight ) {
      tpY = ev.clientY - tpHeight - tpOffset*2 + 'px';
  }
  else {
      tpY = ev.clientY + tpOffset + 'px';
  }
  return {
    x: tpX,
    y: tpY
  };
}

function attachTooltip(ev, src) {
    let tooltip = document.createElement('img');
    tooltip.setAttribute('src', src);
    tooltip.setAttribute('class', 'thv_tip');
    ev.target.style.position = 'relative';
    ev.target.className += ' thv_link';
    ev.target.appendChild(tooltip);
    showTooltip(ev);
}

function showTooltip(el) {
  if (el.target.nodeName == "A") {
    timeoutID = window.setTimeout(function () {
      if (! el.target.getElementsByClassName('thv_tip').length)  {
        loadPreview(el);
      }
      else {
        popTooltip(el);
      }
    }, tpTimeout);
  }
}

function loadPreview(el){
  console.log('Getting preview for ' + el.target.href)
  let result = GM_xmlhttpRequest ({
    method: "GET",
    url:  el.target.href,
    onload: function (res) {
      let parser      = new DOMParser ();
      let responseDoc = parser.parseFromString (res.responseText, "text/html");
      let purl = responseDoc.querySelectorAll('meta[property="og:image"]')[0].getAttribute('content');
      attachTooltip(el, purl);
    },
    onerror: function (res) {console.log(res.statusText);}
  });
}

function popTooltip(ev) {
  let elements = ev.target.getElementsByClassName('thv_tip');
  if (elements.length)  {
    console.log('Show tooltip for ' + ev.target.href)
    tpPos = getPosition(ev);
    elements[0].style.left =  ev.clientX + 15 + 'px';
    elements[0].style.top =  tpPos.y;
    elements[0].style.visibility = 'visible';
    elements[0].style.opacity = 1;
  }
}

function hideTooltip(ev) {
  window.clearTimeout(timeoutID);
  let elements = ev.target.getElementsByClassName('thv_tip');
  if (elements.length)  {
      console.log('Hide tooltip for ' + ev.target.href)
      elements[0].style.visibility = 'hidden';
      elements[0].style.opacity = 0;
  }
}

var links = document.evaluate("//a[contains(@href, 'thingiverse.com/thing:')]",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);

for (var i=0; i<links.snapshotLength; i++) {
  let link = links.snapshotItem(i);
  link.addEventListener('mouseover', showTooltip);
  link.addEventListener('mouseout', hideTooltip);
}

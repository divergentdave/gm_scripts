// ==UserScript==
// @name           Youtube preview
// @namespace      http://divergentdave.googlepages.com/
// @description    Fetch the description for Youtube links, and put it in the hover text
// @include        *
// ==/UserScript==
(function () {
var regex = /watch\?(?:.*=.*&)*v=([-_a-zA-Z0-9]*)/;
var xpath = "descendant-or-self::a[starts-with(@href,'http://www.youtube.com/watch?') or starts-with(@href,'https://www.youtube.com/watch?')]";

function die(str) {
  alert(str);
  throw str;
}

function process(tag) {
  var id = regex.exec(tag.getAttribute('href'))[1];
  if (id.length < 3) die("Strange YouTube ID: " + id);
  GM_xmlhttpRequest({
    method: 'GET',
    url: 'https://gdata.youtube.com/feeds/api/videos/' + id + '?v=2',
    onload: function (details) {
      if (details.status != 200) return;// Video no longer exists
      var parser = new DOMParser();
      var dom = parser.parseFromString(details.responseText, "application/xml");
      var titles = dom.getElementsByTagName('title');
      if (titles.length != 1) die("Didn't find one <title> in GData");
      var title = titles[0];
      if (title.childNodes.length != 1) die("Didn't find one child node of <title>");
      var textNode = title.firstChild;
      if (textNode.nodeType != Node.TEXT_NODE) die("Non-text node found, was of type " + textNode.nodeType);
      tag.setAttribute('title', textNode.nodeValue);
    }
  });
}

function processTree(base) {
  // have to use snapshot over iterator because we modify the DOM in between accesses
  var tags = document.evaluate(xpath, base, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  for (var i = 0, tag = null; (tag = tags.snapshotItem(i)); i++) {
    process(tag);
  }
}

processTree(document);

document.addEventListener('DOMNodeInserted', function(event) {
  processTree(event.target);
}, false);

document.addEventListener('DOMAttrModified', function(event) {
  if (event.attrName == 'href') {
    processTree(event.target);
  }
}, false);

})();
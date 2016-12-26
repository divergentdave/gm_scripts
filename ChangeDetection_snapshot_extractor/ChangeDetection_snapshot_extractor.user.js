// ==UserScript==
// @name        ChangeDetection snapshot extractor
// @namespace   dnc
// @description Add links to compare old versions of sites to themselves.
// @include     https://www.changedetection.com/*
// @version     1
// @grant       none
// ==/UserScript==
document.addEventListener('DOMContentLoaded', function() {
  try {
    var nbsp = String.fromCharCode(160);
    var links = document.links;
    var re = /javascript:loadCompareCache\(%20'([A-F0-9]*)',%20'[0-9]*',%20'([0-9]*)'((?:,'html')|(?:,'fulltext')|)\);/;
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      var result = link.href.match(re);
      if (result !== null) {
        var cursor = link.nextSibling;
        var newHref = "javascript:loadCompareCache('" + result[1] + "', '" + result[2] + "', '" + result[2] + "'" + result[3] + ");";
        var newLink = document.createElement('a');
        newLink.setAttribute('href', newHref);
        newLink.setAttribute('class', 'rclmorelink');
        newLink.appendChild(document.createTextNode('View snapshot'));
        link.parentNode.insertBefore(newLink, cursor);
        link.parentNode.insertBefore(document.createTextNode(nbsp + nbsp + nbsp), newLink);
      }
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
});

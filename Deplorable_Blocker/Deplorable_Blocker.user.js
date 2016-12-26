// ==UserScript==
// @name        Deplorable Blocker
// @namespace   party.davidsherenowitsa.twitter.cesspool
// @description Automatically blocks Twitter accounts by user name
// @include     https://twitter.com/*
// @version     1
// @grant       none
// ==/UserScript==

function mutationCallback(records, observer) {
  scan();
}

var observer = new MutationObserver(mutationCallback);
var nameCache = {};
var waitingForModal = false;

function scan() {
  if (!waitingForModal) {
    var tweet = document.querySelector('li.stream-item div.tweet[data-name~="Deplorable"],' +
                                       'li.stream-item div.tweet[data-name~="🐸"]');
    if (tweet) {
      var name = tweet.dataset.name;
      if (!nameCache[name]) {
        nameCache[name] = true;
        var blockButton = tweet.querySelector(".block-link button");
        if (blockButton && confirm("Block " + name + " (@" +tweet.dataset.screenName + ")?")) {
          blockButton.click();
          waitingForModal = true;
        }
      }
    }
  } else {
    var dialog = document.getElementById("block-dialog");
    if (dialog && dialog.style.display == "block") {
      var button = dialog.querySelector("button.block-button");
      if (button) {
        button.click();
        waitingForModal = false;
      }
    }
  }
}

observer.observe(document.body, {childList: true, subtree: true});

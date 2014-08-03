// ==UserScript==
// @name        Pull Photo
// @description An automated tool to format pull photos for blog posts and news posts at edinarobotics.com. To use, navigate to a photo in a gallery, open the Greasemonkey menu, and select "Create pull photo."
// @namespace   dnc.1816.pullimage
// @include     http://edinarobotics.com/media/photos/*
// @include     http://www.edinarobotics.com/media/photos/*
// @include     http://edinarobotics.com/photos/*
// @include     http://www.edinarobotics.com/photos/*
// @version     1
// @grant       GM_registerMenuCommand
// @grant       GM_setClipboard
// ==/UserScript==

GM_registerMenuCommand("Create pull photo", function(){
  try {
    if (location.pathname.startsWith("/media/photos/")) {
      var centerCol = document.getElementById("centerCol");

      var images = centerCol.getElementsByTagName("img");
      if (images.length == 0) {
        alert("Error: Didn't find image");
        return;
      } else if (images.length > 1) {
        alert("Error: Too many images");
        return;
      }
      var image = images[0];

      var src = image.getAttribute("src");
      var reducedWidth = 260;
      var reducedHeight = "auto";

      var h1s = centerCol.getElementsByTagName("h1");
      if (h1s.length == 0) {
        alert("Error: Didn't find title");
        return;
      } else if (h1s.length > 1) {
        alert("Error: Too many titles");
        return;
      }
      var caption = h1s[0].firstChild.nodeValue.replace(/^\s+|\s+$/g, '');
    } else if (location.pathname.startsWith("/photos/")) {
      var images = document.getElementsByTagName("img");
      if (images.length == 0) {
        alert("Error: Didn't find image");
        return;
      } else if (images.length > 1) {
        alert("Error: Too many images");
        return;
      }
      var image = images[0];

      var src = image.getAttribute("src");
      var reducedWidth = 260;
      var reducedHeight = "auto";
      var caption = "";
    }
    result = prompt("Edit caption", caption);
    if (result) {
      caption = result;
    }

    var body = document.createElement("body");
    var pullPhoto = document.createElement("div");
    pullPhoto.setAttribute("class", "pullPhoto");
    var img1 = document.createElement("img");
    img1.setAttribute("src", src);
    img1.setAttribute("width", reducedWidth);
    img1.setAttribute("height", reducedHeight);
    img1.setAttribute("alt", caption);
    pullPhoto.appendChild(img1);
    var p1 = document.createElement("p");
    p1.appendChild(document.createTextNode(caption));
    pullPhoto.appendChild(p1);
    var popupPhoto = document.createElement("div");
    popupPhoto.setAttribute("class", "popupPhoto");
    var img2 = document.createElement("img");
    img2.setAttribute("src", src);
    img2.setAttribute("alt", caption);
    popupPhoto.appendChild(img2);
    var p2 = document.createElement("p");
    p2.appendChild(document.createTextNode(caption));
    p2.appendChild(document.createElement("br"));
    p2.appendChild(document.createTextNode("Click to Close."));
    popupPhoto.appendChild(p2);
    pullPhoto.appendChild(popupPhoto);
    body.appendChild(pullPhoto);

    var html = body.innerHTML;

    if (typeof GM_setClipboard === "undefined") {
      prompt("Copy this HTML (and update Greasemonkey to the latest version)", html);
    } else {
      GM_setClipboard(html);
      alert("HTML has been copied to the clipboard\n\n" + html);
    }
  } catch (e) {
    alert("Caught an exception\n\n" + e);
    throw e;
  }
}, "c");

// ==UserScript==
// @name           Read-only Facebook
// @namespace      http://www.facebook.com/david.n.cook
// @description    Because your social life does not belong to Facebook
// @include        http://*.facebook.com/*
// ==/UserScript==

GM_addStyle("textarea, .inputtext, .inputpassword, .UIComposer_Box, .UIComposer, .uiTypeahead, .uiUfiAddComment{display: none !important;}");
// ==UserScript==
// @name           Read-only Facebook
// @namespace      http://www.facebook.com/david.n.cook
// @description    Because your social life does not belong to Facebook
// @include        http://*.facebook.com/*
// ==/UserScript==

/* NOTE: To avoid seeing text boxes blink away shortly after the page loads,
 * copy the CSS from inside the quotes, surround it with 
 * @-moz-document domain(facebook.com) { ... } and paste it all into 
 * C:\Users\<username>\AppData\Roaming\Mozilla\Firefox\Profiles\<...>
 * \chrome\userContent.css (or equivalent) and restart your browser.
 */

GM_addStyle("textarea, .inputtext, .uiComposer_Box, .uiComposer, .uiTypeahead, .uiUfiAddComment, .datebox, .uiActionLinks, .GBSearchBox, .commentActions { display: none !important; }\n" +
".gigaboxx_composer>.MessageComposer, .gigaboxx_composer>.MessageComposer textarea, .gigaboxx_composer>.MessageComposer .inputtext, #email, #pass, #password, .uiComposer.MessageComposer { display: block !important; }");

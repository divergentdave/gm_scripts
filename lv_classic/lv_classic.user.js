// ==UserScript==
// @name           LV Classic
// @namespace      http://divergentdave.googlepages.com/
// @include        http://www.laundryview.com/laundry_room.php?lr=*
// @include        http://laundryview.com/laundry_room.php?lr=*
// @include        https://www.laundryview.com/laundry_room.php?lr=*
// @include        https://laundryview.com/laundry_room.php?lr=*
// ==/UserScript==

if (location.href.indexOf('view=c') == -1) location.href += '&view=c';
// ==UserScript==
// @name           Campus alert
// @namespace      http://divergentdave.googlepages.com
// @description    Prevents misinformation
// @include        http://*.umcrookston.edu/*
// @include        http://umcrookston.edu/*
// @include        http://*.duluth.umn.edu/*
// @include        http://duluth.umn.edu/*
// @include        http://*.d.umn.edu/*
// @include        http://d.umn.edu/*
// @include        http://*.r.umn.edu/*
// @include        http://r.umn.edu/*
// @include        http://*.morris.umn.edu/*
// @include        http://morris.umn.edu/*
// ==/UserScript==
domains = ['umn.edu', 'umcrookston.edu'];
for (var i = 0; i < domains.length; i++) {
	if (location.hostname.lastIndexOf(domains[i]) == location.hostname.length - domains[i].length) {
		alert("WARNING\nThis page pertains to a campus other than U of M-TC.");
	}
}

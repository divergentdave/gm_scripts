// ==UserScript==
// @name           On this day
// @namespace      http://divergentdave.googlepages.com
// @description    Time machine for your Gmail
// @include        http://mail.google.com/*
// @include        https://mail.google.com/*
// ==/UserScript==

/*You can enter your custom search parameters here*/ var customquery = "-in:chats -l:calendar -l:college -l:fastweb -l:edline";

function spice(innerfn) {
	return function() {
		try {
			return innerfn.apply(this, arguments);
		} catch(e) {
			GM_log("Exception caught: " + e.name + " - " + e.message);
			var lines = e.stack.split('\n');
			var l1 = lines[0];
			var l2 = lines[1];
			var n1 = parseInt(l1.substring(l1.lastIndexOf(":") + 1, l1.length));
			var n2 = parseInt(l2.substring(l2.lastIndexOf(":") + 1, l2.length));
			GM_log(n1 - n2 + 14); // This magic number is to correct line numbers received from FF/GM, and it is sensitive to how many lines this function takes up, among other things. Not guaranteed to work with recursive code, etc. etc.
		}
	}
}

(spice(function(){
	function addGlobalStyle(css, doc) {
		var head, style;
		head = doc.getElementsByTagName('head')[0];
		if (!head) { return; }
		style = doc.createElement('style');
		style.type = 'text/css';
		style.innerHTML = css;
		head.appendChild(style);
	}
	window.addEventListener('load', spice(function(){
		if (window.wrappedJSObject.gmonkey) {
			window.wrappedJSObject.gmonkey.load("1.0", spice(function(api){
				var afterdate = new Date();
				afterdate.setFullYear(afterdate.getFullYear() - 1);
				var beforedate = new Date();
				beforedate.setFullYear(beforedate.getFullYear() - 1);
				beforedate.setDate(beforedate.getDate() + 1);
				var query = customquery + ' after:' + afterdate.getFullYear() + '/' + (afterdate.getMonth() + 1) + '/' + afterdate.getDate() + ' before:' + beforedate.getFullYear() + '/' + (beforedate.getMonth() + 1) + '/' + beforedate.getDate();
				query = query.replace(/:/g, '%3A').replace(/ /g, '+').replace(/\//g, '%2F');
				var js = null;
				for (var i = 0; i < window.top.frames.length; i++) {
					var frame = window.top.frames[i];
					if (frame.name[0] == 'j') {
						js = frame;
					}
				}
				var url = location.protocol + '//' + location.hostname + location.pathname + '?ui=2&ik=' + js.wrappedJSObject.GLOBALS[9] + '&view=tl&start=0&num=25&rt=h&q=' + query + '&search=query';
				var req = new XMLHttpRequest();
				req.open('GET', url, true);
				req.onreadystatechange = spice(function() {
					if (req.readyState == 4) {
						if (req.status == 200) {
							var index = req.responseText.indexOf('D(["tb"');
							var struct;
							if (index > -1)
							{
								var msgdata = req.responseText.substring(index + 2, req.responseText.indexOf(');', index + 2));
								msgdata = msgdata.replace(/_A\([^)]*\)/g, '"_A(...)"');
								struct = eval(msgdata);//TODO: This is unsafe, but window.JSON is strict
							}
							else
							{
								struct = [[],[],[]];
							}
							var canvasDoc = window.top.document.getElementById("canvas_frame").contentWindow.document;
							addGlobalStyle('.otditem{font-size: 80%; cursor: pointer; background-color: white;} .otdgrayline{border-bottom: 1px solid #CCCCCC;} .otdroundedbox{-moz-border-radius: 4px 4px 0px 0px; border: 2px solid #E0ECFF; background-color: #E0ECFF} .otdtitle{font-size: 80%; background-color: #E0ECFF; padding-bottom: 2px;}', canvasDoc);
							var container = canvasDoc.evaluate('/html/body/div/div[last()]/div/table/tr/td[1]/div[last()]/div', canvasDoc, null,  XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
							if (container == null) {
								container = canvasDoc.evaluate('/html/body/div[1]/div/div/div[last()]/div[1]/div[2]', canvasDoc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
							}
							if (container == null) {
								GM_log('still null??');
							}
							var box = canvasDoc.createElement('div');
							box.setAttribute('class', 'nH pp ps otdroundedbox');
							var titlediv = canvasDoc.createElement('div');
							titlediv.setAttribute('class', 'otdtitle');
							titlediv.appendChild(canvasDoc.createTextNode("On this day"));
							var box2 = canvasDoc.createElement('div');
							box2.setAttribute('class', 'nH');
							box.appendChild(titlediv);
							box.appendChild(box2);
							container.appendChild(box);
							var mod = box2;//good enough for a workaround
							var leetspan = document.createElement('span');//this is for un-htmlentities-ing the bodies of emails
							struct = struct[2];//format change in data
							for (var i = 0; i < struct.length; i++) {
								var msg = struct[i];
								var id = msg[0];
								var body = msg[10];
								var from = msg[7];
								from = from.substring(from.indexOf('>') + 1, from.indexOf('</span>'));
								var subj = msg[9];
								var tick = msg[8];//tick will include html in it, might want to skip it, though
								var div = document.createElement('div');
								if (i == struct.length - 1)
									div.setAttribute('class', 'otditem');
								else
									div.setAttribute('class', 'otditem otdgrayline');
								div.innerHTML = '<b>' + from + '</b>' + tick + subj;
								leetspan.innerHTML = body;
								div.setAttribute('title', leetspan.innerHTML);
								div.setAttribute('messageid', id);
								div.addEventListener('click', spice(function(event){
									top.location.href = top.location.href.split('#')[0] + '#search/' + query + '/' + this.getAttribute('messageid');
								}), true);
								mod.appendChild(div);
							}
						} else {
							GM_log(req.status + '\n' + req.statusText);
						}
					}
				});
				req.send(null);
			}));
		}
	}), true);

}))();

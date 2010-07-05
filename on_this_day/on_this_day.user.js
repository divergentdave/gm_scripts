// ==UserScript==
// @name           On this day
// @namespace      http://divergentdave.googlepages.com
// @description    Time machine for your Gmail
// @include        http://mail.google.com/*
// @include        https://mail.google.com/*
// ==/UserScript==
function spice(innerfn){return function(){try{return innerfn.apply(null,arguments);}catch(e){GM_log("Exception caught: "+e.name+" - "+e.message+"\n"+e.filename+":"+e.lineNumber+"\n"+e.stack);var lines=e.stack.split('\n');var l1=lines[lines.length-3],l2=lines[lines.length-2];var n1=parseInt(l1.substr(l1.length-3,3)),n2=parseInt(l2.substr(l2.length-3,3));GM_log(n1-n2+8);}}}
(spice(function(){
	
	
	var customquery = "-in:chats -l:calendar -l:college -l:fastweb -l:edline";		//Enter your custom search parameters here
	
	
	
	
	
	
	
	function addGlobalStyle(css) {
		var head, style;
		head = document.getElementsByTagName('head')[0];
		if (!head) { return; }
		style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = css;
		head.appendChild(style);
	}
	window.addEventListener('load', spice(function(){
		//GM_log('page is loaded');
		addGlobalStyle('.flooglehorn{font-size: 80%;  border-bottom-width: 1px;  border-bottom-style: solid;  border-bottom-color: rgb(204, 204, 204);  cursor: pointer;  background-color: rgb(232, 238, 247);} .whiteline{background-color: white;}');
		if (unsafeWindow.gmonkey) {
			//GM_log('got the gmonkey');
			unsafeWindow.gmonkey.load("1.0", spice(function(api){
				//GM_log('load is done');
				var afterdate = new Date();
				afterdate.setFullYear(afterdate.getFullYear() - 1);
				var beforedate = new Date();
				beforedate.setFullYear(beforedate.getFullYear() - 1);
				beforedate.setDate(beforedate.getDate() + 1);
				var query = customquery + ' after:' + afterdate.getFullYear() + '/' + (afterdate.getMonth() + 1) + '/' + afterdate.getDate() + ' before:' + beforedate.getFullYear() + '/' + (beforedate.getMonth() + 1) + '/' + beforedate.getDate();
				query = query.replace(/:/g, '%3A').replace(/ /g, '+').replace(/\//g, '%2F');
				var url = location.protocol + '//' + location.hostname + location.pathname + '?ui=2&ik=' + unsafeWindow.top.js.GLOBALS[9] + '&view=tl&start=0&num=25&rt=h&q=' + query + '&search=query';
				var req = new XMLHttpRequest();
				req.open('GET', url, true);
				req.onreadystatechange = spice(function() {
					if (req.readyState == 4) {
						if (req.status == 200) {
							//GM_log('req.responseText');
							var indexA = req.responseText.indexOf('D(["tb"') + 2;
							var msgdata = req.responseText.substring(indexA, req.responseText.indexOf(');', indexA));
							msgdata = msgdata.replace(/_A\([^)]*\)/g, '"_A(...)"');
							//GM_log(msgdata);
							var struct = eval(msgdata);
/*
							GM_log("Adding nav module...");
							var mod = api.addNavModule('On this day');
							GM_log("Added nav module");
*/
							var canvasDoc = window.top.document.getElementById("canvas_frame").contentWindow.document;
							var container = canvasDoc.evaluate('/html/body/div/div[last()]/div/div[2]/div/div[2]/div', canvasDoc, null,  XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
							var box = canvasDoc.createElement('div');
							box.setAttribute('class', 'nH pp ps');
							var box2 = canvasDoc.createElement('div');
							box2.setAttribute('class', 'nH');
							box.appendChild(box2);
							container.appendChild(box);
							var mod = box2;//good enough for a workaround
							var leetspan = document.createElement('span');//this is for un-htmlentities-ing the bodies of emails
							struct = struct[2];//format change in data
							for (var i = 0; i < struct.length; i++) {
								var msg = struct[i];
								var id = msg[0];
								var body = msg[10];
								var isread = msg[3];
								var from = msg[7];
								from = from.substring(from.indexOf('>') + 1, from.indexOf('</span>'));
								var subj = msg[9];
								var tick = msg[8];//tick will include html in it, might want to skip it, though
								var div = document.createElement('div');
								if (isread == '1')
									div.setAttribute('class', 'flooglehorn');
								else
									div.setAttribute('class', 'flooglehorn whiteline');
								//div.innerHTML = from + tick + subj + ' - ' + body;
								div.innerHTML = '<b>' + from + '</b>' + tick + subj;
								leetspan.innerHTML = body;
								div.setAttribute('title', leetspan.innerHTML);
								div.setAttribute('messageid', id);
								div.addEventListener('click', spice(function(event){
									//note: the value of this is getting eaten by spice, so use event.target instead
									top.location.href = top.location.href.split('#')[0] + '#search/' + query + '/' + event.target.getAttribute('messageid');
								}), true);
								mod.appendChild(div);
							}
						} else {
							GM_log(req.status + '\n' + req.statusText);
						}
					}
				});
				//GM_log('sending request');
				req.send(null);
			}));
		}
	}), true);

}))();
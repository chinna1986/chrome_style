function registerTabListener() {
//	chrome.tabs.onActivated.addListener(wikiActivate);
//	chrome.tabs.onUpdated.addListener(wikiUpdate);
}

//registerTabListener();

function changeColor() {
	chrome.tabs.query({active:true}, function(tabs){
		for (var i in tabs) {
			tab = tabs[i];
			chrome.tabs.insertCSS(tab.id, {code:"html,body,div {background-color: #C7EDCC!important;}", allFrames:true});
		}
	});
}

function changeFont() {
	chrome.tabs.query({active:true}, function(tabs){
		for (var i in tabs) {
			tab = tabs[i];
			chrome.tabs.insertCSS(tab.id, {code:"html,body,div {font-family:Palatino Linotype!important;}}", allFrames:true});
		}
	});
}






function splitWindow() {
	var tabCur = 0;
	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
		tabCur = tabs[0].id;
		chrome.tabs.query({ currentWindow: true }, function(tabs){
			var flag = false;
			var ids  = new Array();
			var urls = new Array();
			var idx  = 0;
			for (var i in tabs) {
				tab = tabs[i];
				if (!flag && tab.id != tabCur) continue;
				flag 				= true;
				ids[idx] 		= tab.id;
				urls[idx++] = tab.url;
			}
			chrome.windows.create({ url: urls });
			chrome.tabs.remove(ids);
		});
	});
}

function combineWindow() {
	chrome.tabs.query({ currentWindow: false }, function(tabs) {
		var ids = new Array();
		for (var i in tabs) {
			tab    = tabs[i];
			ids[i] = tab.id;
			chrome.tabs.create({ windowId: chrome.windows.WINDOW_ID_CURRENT, url: tab.url });
		}
		chrome.tabs.remove(ids);
	});
}

chrome.commands.onCommand.addListener(function(command) {
	switch (command) {
		case "changeFont":
		changeFont();
		break;
		case "changeColor":
		changeColor();
		break;
		case "splitWindow":
		splitWindow();
		break;
		case "combineWindow":
		combineWindow();
		break;
	}
});

chrome.commands.getAll(function(cmds) {
	for (var i in cmds) {
		var cmd = cmds[i];
		console.log(cmd.name + " " + cmd.shortcut);
	}
});

var timeout = 30000;



var activeCategories = new Array();

$(function() { 
	displayID = getUrlVars()["id"];
	var WS = WebSocket;
	var wsUri = "ws://pdnet.inf.unisi.ch:9000/newsfeed/socket";
	websocket = new WS(wsUri); 
	websocket.onopen = function(evt) { 
		console.log("CONNECTED"); 
		var hi = JSON.stringify
		({
			"kind":"appReady",
			"displayID":  displayID,
			"size": "big"
		});
		websocket.send(hi);
	}; 

	websocket.onclose = function(evt) { 
		console.log("DISCONNECTED"); 
	};

	websocket.onmessage = function(evt) {
		var response = jQuery.parseJSON(evt.data);
		console.log(response);
		partitionSpace(response);
	};

	websocket.onerror = function(evt) { 
		console.log(evt.data); 
	}; 

});


function partitionSpace(response){
	
	if(response.culture.length > 0 && (jQuery.inArray("culture", activeCategories) == -1)){
		activeCategories.push("culture");
	}
	
	if(response.hot.length > 0 && (jQuery.inArray("hot", activeCategories) == -1)){
		activeCategories.push("hot");
	}
	
	if(response.sport.length > 0 && (jQuery.inArray("sport", activeCategories) == -1)){
		activeCategories.push("sport");
	}
	
	if(response.hot.length > 0 && (jQuery.inArray("sport", activeCategories) == -1)){
		activeCategories.push("sport");
	}
	
	console.log(activeCategories);
	
}

function freeSpace(){
	var free = JSON.stringify
	({
		"kind":"free",
		"displayID":  displayID,
	});
	websocket.send(free);
}

function getUrlVars()
{
	var vars = [], hash;
	var hashes = window.parent.location.href.slice(window.parent.location.href.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++)
	{
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}

function lowerWithoutSpaces(input){
	return input.toLowerCase().split(' ').join('');
}
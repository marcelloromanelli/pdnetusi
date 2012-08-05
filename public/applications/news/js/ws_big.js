var timeout = 30000;

var activeCategories = new Array();
var inactiveCategories = new Array();

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

function updateStatus(responseArray,name){
	if(responseArray.length > 0 && (jQuery.inArray(name, activeCategories) == -1)){
		activeCategories.push(name);
		insertNews(responseArray, name);
		var index = jQuery.inArray(name,inactiveCategories);
		if (index != - 1){
			inactiveCategories.splice(index,1);
		}

	} else {
		inactiveCategories.push(name);
	}
}

function insertNews(responseArray,name){
	console.log(responseArray);
	$(".news."+name).each(function(index){
		if(responseArray[index] != undefined){
			$(this).find("h3").html(responseArray[index].source);
			$(this).find("p").html(responseArray[index].title);
		} else {
//			$(this).hide();
			return;
		}
	});
}

function partitionSpace(response){

	updateStatus(response.culture, "culture");
	updateStatus(response.hot, "hot");
	updateStatus(response.sport, "sport");
	updateStatus(response.tech, "tech");

	if(activeCategories.length == 1){

		var catname = activeCategories[0];
		$("." + catname).show();

		for(var i in inactiveCategories)
		{
			$("." + inactiveCategories[i]).hide();
			console.log("hiding");
		}

	} else if (activeCategories.length == 2){

		console.log("2 ACTIVES");
		for(var i in activeCategories)
		{
			$("." + activeCategories[i] + ".small").show();
			$("." + activeCategories[i] + ".half").show();
			$("." + activeCategories[i] + ".big").hide();
		}

		for(var j in inactiveCategories)
		{
			$("." + inactiveCategories[j]).hide();
		}
	} else {
		for(var j in inactiveCategories)
		{
			$("." + inactiveCategories[j]).hide();
		}
	}

	console.log(activeCategories);
	console.log(inactiveCategories);


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
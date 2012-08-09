var lastPosition = -260;
var newsHeight = 360;
var space = 50;

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
		insertNews(response);
	};

	websocket.onerror = function(evt) { 
		console.log(evt.data); 
	}; 

});

function insertNews(response){
	var culture = response.culture;
	createElements(culture,"culture");
	var hot = response.hot;
	var sport = response.sport;
	var tech = response.tech;
	
}

function createElements(responseArray,name){
	for(var i in responseArray){
		var currentNews = responseArray[i];
		console.log(currentNews.title);
		console.log(currentNews.content + "\n\n");
		
		// NEWS
		var newsDiv = $("<div class='news'");
		newsDiv.css("top",lastPosition);
		lastPosition += (newsHeight + space);
		
		// NEWS CONTAINER
		var newsContainerDiv = $("<div class='news_container'>");
		newsDiv.append(newsContainerDiv);
		
		// NEWS TITLE
		var newsTitleDiv = $("<div class='news_title'>");
		newsTitleDiv.html(currentNews.title);
		newsContainerDiv.append(newsTitleDiv);
		
		newsContainerDiv.append("<hr class='style' />");
		
		// NEWS DESC
		var newsDescDiv = $("div class='news_desc'>");
		newsDescDiv.html(currentNews.content);
		newsContainerDiv.append(newsDescDiv);
		
		$("body").append(newsDiv);

		
	}
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
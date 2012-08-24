//STYLE
var positionOfFirst = -3130;
var positionOfLast = -3130;

var newsHeight = 360;
var space = 50;
var total = space + newsHeight;

var displayID = null;
var currentRequestID = 0;
var activeRequests = 0;

var newsScroll = null;
var NEWS_TIMEOUT = 6000;
var SLIDE_SPEED = 2500;

$(function () {
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
			"size": "small"
		});
		websocket.send(hi);
	}; 

	websocket.onclose = function(evt) { 
		console.log("DISCONNECTED");
		clearInterval(newsScroll);
	};

	websocket.onmessage = function(evt) {
		var response = jQuery.parseJSON(evt.data);
		console.log(response);
		insertNews(response);
	};

	websocket.onerror = function(evt) { 
		console.log(evt.data); 
	}; 

});

function checkIfNeedsMore(){

	var canaryTop = $(".news").get(0).style.top;
	if(canaryTop == "-1490px"){
		console.log("ATTENTION! LOAD NEW NEWS");
		var more = JSON.stringify
		({
			"kind":"more",
			"displayID":  displayID,
			"pos": "top",
			"from": "small"
		});
		console.log(more);
		websocket.send(more);
	}

	var canaryBottom = $(".news").get(-1).style.top;
	if(canaryBottom == "1790px"){
		console.log("ATTENTION! LOAD NEW NEWS");
		var more = JSON.stringify
		({
			"kind":"more",
			"displayID":  displayID,
			"pos": "bottom",
			"from": "small"
		});
		console.log(more);
		websocket.send(more);
	}
}


function createElements(responseArray,name){
	var response = new Array();
	for(var i in responseArray){
		var currentNews = responseArray[i];
		// NEWS
		var newsDiv = $("<div class='news'>");

		// NEWS CONTAINER
		var newsContainerDiv = $("<div class='news_container'>");
		newsDiv.append(newsContainerDiv);
		newsContainerDiv.click(newsClick);


		// NEWS DESC
		var newsDescDiv = $("<div class='news_desc'>");
		newsDescDiv.css("height","280px");
		newsDescDiv.html("<p>" + (currentNews.content).replace(/(<([^>]+)>)/ig,"") +"</p>");
		newsContainerDiv.append(newsDescDiv);

		var newsSourceDiv = $("<div class='news_source'>");
		newsSourceDiv.html(currentNews.source);
		newsContainerDiv.append(newsSourceDiv);

		// CATEGORY
		var categoryDiv = $('<div class="category"><p class="vertical_text">'+ name +'</p></div>');
		categoryDiv.addClass(name);
		newsDiv.append(categoryDiv);

		// SOCIAL
		var socialDiv = $("<div class='social'>");
		newsDiv.append(socialDiv);

		// SOCIAL TABS

		// LIKE
		var socialLikeDiv = $("<div class='social_tab first'>");
		socialLikeDiv.addClass(name);
		var likeImg = $("<img src='images/up.png' width='70px' " +
		"style='clear: both; margin-top: 5px; margin-left: 15px;'></img>");
		socialLikeDiv.append(likeImg);
		socialLikeDiv.append("<p class='counter'>0</p>");
		socialDiv.append(socialLikeDiv);

		socialLikeDiv.click({isLike: true},showCounter);


		// DISLIKE
		var socialDislikeDiv = $("<div class='social_tab center'>");
		socialDislikeDiv.addClass(name);
		socialDislikeDiv.append("<img src='images/down.png' width='70px' " +
		"style='clear: both; margin-top: 5px; margin-left: 15px;'></img>");
		socialDislikeDiv.append("<p class='counter'>0</p>");
		socialDiv.append(socialDislikeDiv);
		socialDislikeDiv.click({isLike: false},showCounter);


		// SHARE
		var socialShareDiv = $("<div class='social_tab last'>");
		socialShareDiv.addClass(name);
		var shareImg = $("<img class='share' src='images/share.png' width='70px'></img>");		
		socialShareDiv.append(shareImg);
		socialShareDiv.data("tiny",'http://json-tinyurl.appspot.com/?url=' + currentNews.link + '&callback=?')
		socialShareDiv.click(swapImgWithQR);
		socialDiv.append(socialShareDiv);
		newsDiv.data("timestamp", new Date().getTime());
		response.push(newsDiv);
	}

	return response;
}



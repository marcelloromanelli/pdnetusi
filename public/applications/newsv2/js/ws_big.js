var lastPosition = -260;
var newsHeight = 360;
var space = 50;
var total = space + newsHeight;

var startingPositions = [];
var newsDivs = [];

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
//		shuffleNews();
	};

	websocket.onerror = function(evt) { 
		console.log(evt.data); 
	}; 

});

function insertNews(response){
	var culture = response.culture;
	createElements(culture,"culture");
	
	var hot = response.hot;
	createElements(hot,"hot");
	
	var sport = response.sport;
	createElements(sport,"sport");
	
	var tech = response.tech;
	createElements(tech,"tech");
	
	newsDivs.sort(function() { return 0.5 - Math.random() });
	
	for(var i in newsDivs){
		var currentNews = newsDivs[i];
		currentNews.css("top",startingPositions[i]);
		$("body").append(currentNews);
	}

}

function createElements(responseArray,name){
	for(var i in responseArray){
		var currentNews = responseArray[i];
		console.log(currentNews.title);
		console.log(currentNews.content + "\n\n");
		
		// NEWS
		var newsDiv = $("<div class='news'>");
		//newsDiv.css("top",lastPosition);
		startingPositions.push(lastPosition);
		lastPosition += (newsHeight + space);

		// NEWS CONTAINER
		var newsContainerDiv = $("<div class='news_container'>");
		newsDiv.append(newsContainerDiv);
		
		// NEWS TITLE
		var newsTitleDiv = $("<div class='news_title'>");
		newsTitleDiv.html(currentNews.title);
		newsContainerDiv.append(newsTitleDiv);
		newsTitleDiv.click(function(){$(".news").animate({"top":"-="+total});});
		
		newsContainerDiv.append("<hr class='style' />");
		
		// NEWS DESC
		var newsDescDiv = $("<div class='news_desc'>");
		newsDescDiv.html((currentNews.content).replace(/(<([^>]+)>)/ig,""));
		
		newsContainerDiv.append(newsDescDiv);
		
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
		socialLikeDiv.append("<img src='images/up.png' width='50px' " +
							"style='clear: both; margin-top: 15px; margin-left: 15px;'></img>");
		socialLikeDiv.append("<p class='counter'>0</p>");
		socialDiv.append(socialLikeDiv);
		
		socialLikeDiv.click(function(){
			var count = parseInt($(this).find("p").html()) + 1;
			$(this).find("p").html(count);
		});
		
		// DISLIKE
		var socialDislikeDiv = $("<div class='social_tab center'>");
		socialDislikeDiv.addClass(name);
		socialDislikeDiv.append("<img src='images/down.png' width='50px' " +
							"style='clear: both; margin-top: 15px; margin-left: 15px;'></img>");
		socialDislikeDiv.append("<p class='counter'>0</p>");
		socialDiv.append(socialDislikeDiv);
		
		socialDislikeDiv.click(function(){
			var count = parseInt($(this).find("p").html()) + 1;
			$(this).find("p").html(count);
		});
		
		// SHARE
		var socialShareDiv = $("<div class='social_tab last'>");
		socialShareDiv.addClass(name);
		var shareImg = $("<img class='share' src='images/share.png' width='50px'></img>")
		var qrImg = $("<img src='http://chart.apis.google.com/chart?cht=qr&chs=120x120&chl=http%3A//www.usi.ch&chld=H|0' " +
				"style='display:none; width:100%;'></img>");
		socialShareDiv.append(shareImg);
		socialShareDiv.append(qrImg);

		socialShareDiv.click({share: shareImg, qr: qrImg},fadeQR);
		
		socialDiv.append(socialShareDiv);
	
		newsDivs.push(newsDiv);
	}
}

function fadeQR(event){
	var share = event.data.share;
	var qr = event.data.qr;
	
	share.fadeOut(1000,function(){qr.fadeIn();});
	
	setTimeout(function(){qr.fadeOut(1000,
						function(){
							share.fadeIn();
						}
					);
				},10000);
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
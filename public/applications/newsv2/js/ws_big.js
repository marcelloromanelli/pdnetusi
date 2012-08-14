//STYLE
var lastPosition = -260;
var newsHeight = 360;
var space = 50;
var total = space + newsHeight;

var displayID = null;
var currentRequestID = 0;
var activeRequests = 0;

var startingPositions = [];
var newsDivs = [];

function getUrlVars() {
	"use strict";
	var vars = [], hash;
	var i = 0;
	var hashes = window.parent.location.href.slice(window.parent.location.href.indexOf('?') + 1).split('&');
	for(i = 0; i < hashes.length; i++)
	{
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}

function lowerWithoutSpaces(input) {
	return input.toLowerCase().split(' ').join('');
}


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

	newsDivs.sort(
			function(){ 
				return 0.5 - Math.random(); 
			}
	);

	for (var i in newsDivs){

		var currentNews = newsDivs[i];

		if(i == 0){
			currentNews.addClass("first");
		}

		if(i == newsDivs.length-1){
			currentNews.addClass("last");
		}

		currentNews.css("top",startingPositions[i]);
		currentNews.addClass("requestID-"+currentRequestID);
		$("body").append(currentNews);
	}

//	var t = setTimeout(removeRequestsID,5000,currentRequestID);

	activeRequests++;
	currentRequestID++;

	$(".news_title").dotdotdot({});
	$(".news_desc").dotdotdot({});

	$("img").mousedown(function(){
		return false;
	});
}

function removeRequestsID(id){
	if(activeRequests > 1){
		console.log("Removing requestID-" + id);
		var itemsToRemove = $(".requestID-" + id);
		itemsToRemove.fadeOut(1500,function(){$(this).remove();});
		activeRequests--;
	}
}
function createElements(responseArray,name){
	for(var i in responseArray){
		var currentNews = responseArray[i];

		// NEWS
		var newsDiv = $("<div class='news'>");
		//newsDiv.css("top",lastPosition);
		startingPositions.push(lastPosition);
		lastPosition += (newsHeight + space);

		// NEWS CONTAINER
		var newsContainerDiv = $("<div class='news_container'>");
		newsDiv.append(newsContainerDiv);
		newsContainerDiv.click(
				function(){
					var parent = $(this).parent();
					var pos = parent.position();

					if(parent.hasClass("first") && pos.top > 559){
						$(".news").animate({"top":"-="+total});
						return;
					}

					if(parent.hasClass("last") && pos.top < 559){
						$(".news").animate({"top":"+="+total});
						return;
					}

					if(pos.top > 559){
						$(".news").animate({"top":"-="+total});
					} else {
						$(".news").animate({"top":"+="+total});
					}
				}
		);

		// NEWS TITLE
		var newsTitleDiv = $("<div class='news_title'>");
		newsTitleDiv.html(currentNews.title);
		newsTitleDiv.css("height","46px");

		newsContainerDiv.append(newsTitleDiv);

		newsContainerDiv.append("<hr class='style' />");

		// NEWS IMG
		var newsImg = $("<img class='news_img'>");
		if(currentNews.imgs.length == 0){
			newsImg.attr("src","http://panhandletickets.com/images/not_available.jpg");
		}

		var src = $(currentNews.imgs[0]).attr("src");
		// HACK FOR CDT
		if(!/^\w+:/.test(src)){
			src='http://www.cdt.ch' + src;
		}
		newsImg.attr("src",src);
		newsContainerDiv.append(newsImg);

		// NEWS DESC
		var newsDescDiv = $("<div class='news_desc'>");
		newsDescDiv.css("height","200px");
		newsDescDiv.html("<p>" +
				(currentNews.content).replace(/(<([^>]+)>)/ig,"") +
		"</p>");

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
		var likeImg = $("<img src='images/up.png' width='50px' " +
		"style='clear: both; margin-top: 15px; margin-left: 15px;'></img>");
		socialLikeDiv.append(likeImg);
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
		var shareImg = $("<img class='share' src='images/share.png' width='50px'></img>");		
		socialShareDiv.append(shareImg);



		var qrImgSrc = "http://chart.apis.google.com/chart?cht=qr&chs=215x215&chl="+currentNews.link+"&chld=H|0";

		socialShareDiv.click(
				{
					div: socialShareDiv,
					share: shareImg, 
					qr: qrImgSrc, 
					img: newsImg
				},
				fadeQR);

		socialDiv.append(socialShareDiv);

		newsDivs.push(newsDiv);
	}
}

function fadeQR(event){
	var shareDIV = event.data.div;
	shareDIV.effect("highlight", {}, 3000);

	
	
	var share = event.data.share;
	var qr = event.data.qr;
	var img = event.data.img;
	var oldImgSrc = null;

	img.fadeOut('slow',
			function(){
		oldImgSrc = img.attr("src");
		img.attr("src",qr);
		img.fadeIn('slow');
	}
	);

	setTimeout(function(){
		img.fadeOut('slow',
				function(){
			img.attr("src",oldImgSrc);
			img.fadeIn('slow');
		}
		);
	},25000);
}

function freeSpace(){
	var free = JSON.stringify
	({
		"kind":"free",
		"displayID":  displayID,
	});
	websocket.send(free);
}


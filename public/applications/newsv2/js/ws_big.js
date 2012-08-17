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
		console.log(response);
		insertNews(response);
	};

	websocket.onerror = function(evt) { 
		console.log(evt.data); 
	}; 

	newsScroll = setInterval(function(){moveNews()},6000);

});

function moveNews(){
	var allNews = $(".news"); 

	if(allNews.length > 4){
		//GET ALL THE NEWS
		allNews.animate({"top":"-="+total}, { duration: 3000, easing: "linear"});
		checkIfNeedsMore(allNews);
	}
}


function checkIfNeedsMore(allNews){
	positionOfFirst = $(allNews).position().top;
	positionOfLast = $(allNews[allNews.length-1]).position().top;

	var canaryTop = $(allNews[0]).position().top;
	if(canaryTop == -1490){
		console.log("ATTENTION! LOAD NEW NEWS");
		var more = JSON.stringify
		({
			"kind":"more",
			"displayID":  displayID,
			"pos": "top"
		});
		console.log(more);
		websocket.send(more);
	}

	var canaryBottom = $(allNews[allNews.length-1]).position().top;
	if(canaryBottom == 1790){
		console.log("ATTENTION! LOAD NEW NEWS");
		var more = JSON.stringify
		({
			"kind":"more",
			"displayID":  displayID,
			"pos": "bottom"
		});
		console.log(more);
		websocket.send(more);
	}
}
function insertNews(response){

	var culture = createElements(response.culture,"culture");
	var hot = createElements(response.hot,"hot");
	var sport = createElements(response.sport,"sport");
	var tech = createElements(response.tech,"tech");

	var newsDivs = culture.concat(hot).concat(sport).concat(tech); 

	newsDivs.sort(
			function(){ 
				return 0.5 - Math.random(); 
			}
	);

	if (newsDivs.length < 10 && $(".news").length > 5){
		if(response.pos == undefined || response.pos == "bottom"){
			console.log("RECYCLING NEWS AT THE TOP");
			var top5 = $(".news").slice(5);
			var newsDivs = newsDivs.concat(top5);
			top5.remove();
		} else if(response.pos == "top") {
			console.log("RECYCLING NEWS AT THE BOTTOM");
			var last5 = $(".news").slice(-5);
			var newsDivs = newsDivs.concat(last5);
			last5.remove();
		}
	}

	for (var i in newsDivs){
		var currentNews = newsDivs[i];
		if(response.pos == undefined || response.pos == "bottom"){
			console.log("APPENDED TO BOTTOM");
			var currentPosition = positionOfLast + total*i; 
			$("body").append(currentNews);
			currentNews.css("top",currentPosition);
			if(i == newsDivs.length-1){
				positionOfLast = currentPosition;
			}
		} else {
			console.log("APPENDED TO TOP");
			var currentPosition = positionOfFirst - total*i; 
			$("body").prepend(currentNews);
			currentNews.css("top",currentPosition);
			if(i == newsDivs.length-1){
				positionOfFirst = currentPosition;
			}
		}
		if(i == 0){
			currentNews.addClass("first");
		}
		if(i == newsDivs.length-1){
			currentNews.addClass("last");
		}
		currentNews.addClass("requestID-"+currentRequestID);
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

function updateFirstandLastPositions(news){
	positionOfFirst = $(news[0]).position().top;
	positionOfLast = $(news[news.length-1]).position().top;
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
		newsContainerDiv.click(
				function(){
					var parent = $(this).parent();
					var pos = parent.position();

					// STOP AUTOMATIC MOVMENT
					clearInterval(newsScroll);
					// RESTART IT AFTER 15 seconds
					setTimeout(function(){
						clearInterval(newsScroll);
						newsScroll = setInterval(function(){moveNews()},9000);
					},15000);


					if(parent.hasClass("first") && pos.top > 559){
						$(".news").animate({"top":"-="+total});
						updateFirstandLastPositions($(".news"));
						checkIfNeedsMore($(".news"));
						return;
					}

					if(parent.hasClass("last") && pos.top < 559){
						$(".news").animate({"top":"+="+total});
						updateFirstandLastPositions($(".news"));
						checkIfNeedsMore($(".news"));
						return;
					}

					if(pos.top > 559){
						$(".news").animate({"top":"-="+total});
						updateFirstandLastPositions($(".news"));
					} else {
						$(".news").animate({"top":"+="+total});
						updateFirstandLastPositions($(".news"));
					}

					checkIfNeedsMore($(".news"));

				}
		);

		// NEWS TITLE
		var newsTitleDiv = $("<div class='news_title'>");
		newsTitleDiv.html(currentNews.title);
		newsTitleDiv.css("height","50px");

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
			src="http://panhandletickets.com/images/not_available.jpg";
		}
		newsImg.attr("src",src);
		newsContainerDiv.append(newsImg);

		// NEWS DESC
		var newsDescDiv = $("<div class='news_desc'>");
		newsDescDiv.css("height","230px");
		newsDescDiv.html("<p>" +
				(currentNews.content).replace(/(<([^>]+)>)/ig,"") +
		"</p>");

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

		socialLikeDiv.click(function(){
			var p = $(this).find("p");
			var count = parseInt(p.html()) + 1;
			p.html(count);

			var image = $(this).find("img");
			image.add(p).fadeOut('slow',
					function(){
				p.fadeOut();
				image.attr("src","images/oneup.png");
				image.fadeIn('slow');
			}
			);

			setTimeout(function(){
				image.fadeOut('slow',
						function(){
					p.fadeIn();
					image.attr("src","images/up.png");
					image.add(p).fadeIn('slow');
				}
				);
			},5000);
		});

		// DISLIKE
		var socialDislikeDiv = $("<div class='social_tab center'>");
		socialDislikeDiv.addClass(name);
		socialDislikeDiv.append("<img src='images/down.png' width='70px' " +
		"style='clear: both; margin-top: 5px; margin-left: 15px;'></img>");
		socialDislikeDiv.append("<p class='counter'>0</p>");
		socialDiv.append(socialDislikeDiv);

		socialDislikeDiv.click(function(){
			var p = $(this).find("p");
			var count = parseInt(p.html()) + 1;
			p.html(count);

			var image = $(this).find("img");
			image.add(p).fadeOut('slow',
					function(){
				p.fadeOut();
				image.attr("src","images/onedown.png");
				image.fadeIn('slow');
			}
			);

			setTimeout(function(){
				image.fadeOut('slow',
						function(){
					p.fadeIn();
					image.attr("src","images/down.png");
					image.add(p).fadeIn('slow');
				}
				);
			},5000);
		});

		// SHARE
		var socialShareDiv = $("<div class='social_tab last'>");
		socialShareDiv.addClass(name);
		var shareImg = $("<img class='share' src='images/share.png' width='70px'></img>");		
		socialShareDiv.append(shareImg);



		var qrImgSrc = "http://chart.apis.google.com/chart?cht=qr&chs=205x205&chl="+currentNews.link+"&chld=H|0";

		socialShareDiv.click(
				{
					share: shareImg, 
					qr: qrImgSrc, 
					img: newsImg
				},
				fadeQR);

		socialDiv.append(socialShareDiv);

		response.push(newsDiv);
	}

	return response;
}

function fadeQR(event){
	var share = event.data.share;
	share.effect("pulsate", { times:25 }, 1000);
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


function getUrlVars() {
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

function moveNews(goUp,speed){ 
	if(goUp){
		var params = {"top":"+="+total};
	} else {
		var params = {"top":"-="+total}
	}
	if($(".news").length > 10){
		//GET ALL THE NEWS
		$(".news").animate(params, speed, "linear",updateAndCheck());		
	}
}

function updateAndCheck(){
	positionOfFirst = $(".news").get(0).style.top;
	positionOfLast = $(".news").get(-1).style.top;
	checkIfNeedsMore();
}

function insertNews(response){

	clearInterval(newsScroll);

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

	if (newsDivs.length == 0 && $(".news").length > 5){
		if(response.pos == "bottom"){
			console.log("RECYCLING NEWS AT THE TOP");

			var currentPosition = 0;
			$(".news").slice(0,10).each(function(index){
				var copy = $(this).clone(true,true);
				$(this).detach();
				currentPosition = parseInt(positionOfLast) + total*index; 
				copy.css("top", currentPosition);
				copy.appendTo("body");				
			});

			positionOfLast = currentPosition + "px";
			console.log("LAST POS: " + positionOfLast);
		} else if(response.pos == "top") {
			console.log("RECYCLING NEWS AT THE BOTTOM");
			var currentPosition = 0;
			var len = $(".news").length;

			$(".news").slice(len-10,len).each(function(index){
				var copy = $(this).clone(true,true);
				$(this).detach();
				currentPosition = parseInt(positionOfFirst) - total*index; 
				copy.css("top", currentPosition);
				copy.prependTo("body");
				console.log(copy);
			});

			positionOfFirst = currentPosition + "px";
			console.log("FIRST POS: " + positionOfFirst);
		}
	}

	console.log(newsDivs.length + " more news are being inserted!");

	for (var i in newsDivs){

		var currentNews = newsDivs[i];
		if (currentNews instanceof jQuery){

		} else {
			currentNews = $(currentNews);
		}

		if(response.pos == "bottom"){
			var currentPosition = parseInt(positionOfLast) + total*i; 
			$("body").append(currentNews);
			currentNews.css("top",currentPosition);
			if(i == newsDivs.length-1){
				positionOfLast = currentPosition + "px";
			}
		} else if(response.pos == "top"){
			var currentPosition = parseInt(positionOfFirst) - total*i; 
			$("body").prepend(currentNews);
			currentNews.css("top",currentPosition);
			if(i == newsDivs.length-1){
				positionOfFirst = currentPosition + "px";
			}
		} else {
			var currentPosition = parseInt(positionOfLast) + total*i; 
			$("body").append(currentNews);
			currentNews.css("top",currentPosition);
			if(i == newsDivs.length-1){
				positionOfLast = currentPosition + "px";
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

	activeRequests++;
	currentRequestID++;

	$(".news_title").dotdotdot({});
	$(".news_desc").dotdotdot({});

	$("img").mousedown(function(){
		return false;
	});

	newsScroll = setInterval(function(){moveNews(false, SLIDE_SPEED)},NEWS_TIMEOUT);

	if($(".news").length > 50){
		var rem = 0;
		var len = $(".news").length;
		$(".news").each(function(){
			var eta =  new Date().getTime() - $(this).data("timestamp");
			// Check if the news is older than 2min
			var diff = len - rem;
			if (eta > 1000*60*2 && diff > 50){
				rem += 1;
				$(this).fadeOut(2000, function(){$(this).remove();})
			}
		});
		console.log(rem + " news have been removed");
	}

}

function stopMovmentAndRestart(seconds){
	// STOP AUTOMATIC MOVMENT
	clearInterval(newsScroll);
	// RESTART IT AFTER x seconds
	setTimeout(function(){
		clearInterval(newsScroll);
		newsScroll = setInterval(function(){
			moveNews(false,SLIDE_SPEED);
		},NEWS_TIMEOUT);
	},seconds);
}

function showCounter(event){
	stopMovmentAndRestart(5000);
	var image = $(this).find("img");
	if(!image.data("active")){
		image.data("active", true);
		var p = $(this).find("p");
		if(event.data.isLike){
			var count = parseInt(p.html()) + 1;
		} else {
			var count = parseInt(p.html()) - 1;
		}
		p.html(count);

		p.fadeOut('fast');
		image.fadeOut('slow',
				function(){
			$(this).parent().append("<div class='countBig'>" + count + "</div>");
		}
		);


		var div = $(this);
		setTimeout(function(){
			console.log($(this));
			div.find(".countBig").remove();
			image.add(p).fadeIn('slow');
			image.data("active", false);
		},2500);
	}
}

function newsClick(){
	var parent = $(this).parent();
	var pos = parent.position();

	stopMovmentAndRestart(15000);

	if(parent.hasClass("first") && pos.top > 559){
		moveNews(false,500);
		return;
	}

	if(parent.hasClass("last") && pos.top < 559){
		moveNews(true,500);
		return;
	}

	if(pos.top > 559){
		moveNews(false,500);
	} else {
		moveNews(true,500);
	}
}

function swapImgWithQR(event){
	if($(this).data("active") == true){
		return false;
	} else if ($(this).data("active") == false) {
		$(this).data("active", true);
	}
	
	stopMovmentAndRestart(25000);

	$(this).find("img").effect("pulsate", { times:25 }, 1000);
	var newsContainer = $(this).parent().parent().find(".news_container"); 
	var img = newsContainer.find("img");

	if(event.data.isBig){
		var size = "205x205";
	} else {
		var size = "350x360";
	}

	$.getJSON($(this).data("tiny"), function(data){ 

		var qr = "http://chart.apis.google.com/chart?cht=qr&chs=" + size + "&chl=" + data.tinyurl + "&chld=H|0"

		if(event.data.isBig){
			var oldImgSrc;
			img.fadeOut('slow',
					function(){
				oldImgSrc = img.attr("src");
				img.attr("src",qr);
				img.fadeIn('slow');
			}
			);
			setTimeout(function(){
				img.parent().parent().find(".news_container").find("img").fadeOut('slow',
						function(){
					img.attr("src",oldImgSrc);
					img.fadeIn('slow');
				}
				);
			},25000);

		} else {
			var newsDesc = newsContainer.find(".news_desc");
			var newsSrc = newsContainer.find(".news_source");
			newsSrc.fadeOut('fast');
			newsDesc.fadeOut('slow',function(){
				var bigImg = $("<img>");
				bigImg.attr("src",qr);
				bigImg.css("margin-left","-10px");
				bigImg.css("margin-top","-10px");
				newsContainer.append(bigImg);
				setTimeout(function(){
					bigImg.fadeOut('slow',function(){newsDesc.add(newsSrc).fadeIn('slow');});
					$(this).data("active",false);
				},25000);
			});
		}


	}
	);
}
var queue = new Array();
var lastid = null;
var tag = "100ThingsILike";
var nextpage = null;

$.ajax({
	url: 'http://search.twitter.com/search.json?q=%23' + tag + '&rpp=4',
	type: 'GET',
	dataType: 'jsonp',
	success: function(data, textStatus, xhr) {
		for (var i = 0; i < data.results.length; i++){	
			var currentTweet = data.results[i];
			var tweetDiv = createTweetDiv(currentTweet,i);					
			$("body").append(tweetDiv);			
			lastid = currentTweet.id;
			$(".tweet_text").dotdotdot({});

		}  
		jQuery("abbr.timeago").timeago();                
	}   

});

function findNewTweets(){
	$.ajax({
		url: 'http://search.twitter.com/search.json' + nextpage,
		type: 'GET',
		dataType: 'jsonp',
		success: function(data, textStatus, xhr) {
			var nextpage = data.next_page;
			for (var i = 0; i < data.results.length; i++){	
				var currentTweet = data.results[i];
				var tweetDiv = createTweetDiv(currentTweet,i);					
				
				var ithTweet = $(".tweet").get(i);
				$(ithTweet).animate({"margin-left": "-560px"},1500, newStuff(i, tweetDiv));
				lastid = currentTweet.id;
				$(".tweet_text").dotdotdot({});
			}  
		}   

	});
}

var newStuff = function(i, tweetDiv){
	return function(){
		tweetDiv.css("margin-left","-560px");
		var ith = $(".tweet").get(i);
		$(ith).replaceWith(tweetDiv);
		tweetDiv.animate({"margin-left": "8px"}, 1000);
	}
}

function createTweetDiv(currentTweet,i){
	var tweetDiv = $("<div class='tweet'></div>");

	var usernameDiv = $("<div class='username'>" + currentTweet.from_user_name + "</div>");
	var tweetText = $("<div class='tweet_text'>" + currentTweet.text + "</div>");
	var tweetTime = $("<abbr class='timeago'></abbr>");
	tweetTime.attr("title",currentTweet.created_at);
	tweetTime.html(jQuery.timeago(currentTweet.created_at));


	tweetDiv.append(usernameDiv);
	tweetDiv.append(tweetText);
	tweetDiv.append(tweetTime);

	if(i == 0){
		tweetDiv.addClass("first");
	}


	var profileImg = $("<img class='profilepic'>");
	profileImg.attr("src","https://api.twitter.com/1/users/profile_image?screen_name=" + currentTweet.from_user + "&size=original");
	if (profileImg[0].clientWidth > 18){
		console.log('Image not found. Using default.');
		profileImg.attr("src","http://a0.twimg.com/sticky/default_profile_images/default_profile_2.png");
	}

	tweetDiv.append(profileImg);

	return tweetDiv;
}

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


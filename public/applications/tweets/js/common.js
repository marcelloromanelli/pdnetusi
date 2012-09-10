var nextpage = null;
var refreshurl = null;
var last = new Array();
var tag = "usilugano";

$.ajax({
	url: 'http://search.twitter.com/search.json?q=%23' + tag + '&rpp=4',
	dataType: 'jsonp',
	success: function(data, textStatus, xhr) {
		nextpage = data.next_page;
		refreshurl = data.refresh_url
		for (var i = 0; i < data.results.length; i++){	
			var currentTweet = data.results[i];
			var tweetDiv = createTweetDiv(currentTweet,i);					
			$("body").append(tweetDiv);
			$(".tweet_text").dotdotdot({});
		}
		$("img").mousedown(function(){
			return false;
		});
		jQuery("abbr.timeago").timeago(); 
	}   
	
});

function createObject(title,desc,link,img){
	var obj = {};
	obj.title = title;
	obj.desc = desc;
	obj.link = link;
	obj.img = img;
	return obj;
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
	var userProfileUrl = "https://twitter.com/"+ currentTweet.from_user;
	
	tweetDiv.click(function(){
		var img = $(this).find("img");
		img.data("old",img.attr("src"));
		img.attr("src","http://chart.apis.google.com/chart?cht=qr&chs=200x200&chl="+ userProfileUrl +"&chld=H|0");
		setTimeout(function(){img.attr("src",img.data("old"));},25000);
	});
	
	var usernameDiv = $("<div class='username'>" + currentTweet.from_user_name + "</div>");
	var tweetText = $("<div class='tweet_text'>" + currentTweet.text + "</div>");

	var tweetTime = $("<abbr class='timeago'></abbr>");
	tweetTime.attr("title",currentTweet.created_at);
	tweetTime.html("<p class='timeago' >" + jQuery.timeago(currentTweet.created_at) + "</p>");


	tweetDiv.append(usernameDiv);
	tweetDiv.append(tweetText);
	tweetDiv.append(tweetTime);

	if(i == 0){
		tweetDiv.addClass("first");
	}


	var profileImg = $("<img class='profilepic'>");
	profileImg.attr("onerror","this.src='http://a0.twimg.com/sticky/default_profile_images/default_profile_3.png'");
	var profileImgUrl = "https://api.twitter.com/1/users/profile_image?screen_name=" + currentTweet.from_user + "&size=original";
	profileImg.attr("src","https://api.twitter.com/1/users/profile_image?screen_name=" + currentTweet.from_user + "&size=original");
	profileImg.mousedown(function(){
		return false;
	});

	tweetDiv.append(profileImg);
	last.push(createObject(currentTweet.from_user_name, currentTweet.text, userProfileUrl, profileImgUrl));
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


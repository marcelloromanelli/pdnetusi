var hashtags = new Array();
var counter = 0;
var tag = "usilugano";

$(function(){		
		displayID = getUrlVars()["id"];
		var WS = WebSocket;
		var wsUri = "ws://pdnet.inf.unisi.ch:9000/twitter/socket";
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
	};

	websocket.onmessage = function(evt) {
		var response = jQuery.parseJSON(evt.data);
		if(response.kind == "stats"){
			$("#mobile_count").html(response.mobiles);
		} else if (response.kind == "newhashtag"){
			if($.inArray(response.hashtag, hashtags) == -1){
				hashtags.push(response.hashtag);
			}
		}
	};

	websocket.onerror = function(evt) { 
		console.log(evt.data); 
	}; 
	
	setInterval(function(){findNewTweets();},15000);
	$("#hashtag").html("#"+tag);
		
});	
		

function findNewTweets(){
	if(last.length > 10){
		last = new Array();
	}
	if(nextpage == undefined){
		if(hashtags.length == 0){
			nextpage = refreshurl + "&rpp=4";
		} else {
			if(counter > hashtags.length - 1){
				counter = 0;
			} else {
				console.log(counter);
				console.log(hashtags[counter]);
				hashtags.push(tag);
				tag = hashtags[counter];
				nextpage = "?q=%23" + tag + "&rpp=4";
				$("#hashtag").html("#" + tag);
				counter++;
			}
		}
	}
	$.ajax({
		url: 'http://search.twitter.com/search.json' + nextpage,
		dataType: 'jsonp',
		success: function(data, textStatus, xhr) {
			// Show at most 16 tweets per query
			if(data.page > 3 && hashtags.length > 0){
				hashtags.push(tag);
				tag = hashtags[counter];
				nextpage = "?q=%23" + tag + "&rpp=4";
				$("#hashtag").html("#" + tag);
				counter++;
			} else {
				nextpage = data.next_page;
			}
			refreshurl = data.refresh_url
			for (var i = 0; i < data.results.length; i++){	
				var currentTweet = data.results[i];
				var tweetDiv = createTweetDiv(currentTweet,i);					
				if($(".tweet").length < 4){
					$($(".tweet").get(0)).before(tweetDiv);			
				} else {
					var ithTweet = $(".tweet").get(3-i);
					$(ithTweet).animate({"margin-left": "-560px"},1500, newStuff(3-i, tweetDiv));
				}
			}
			$("img").mousedown(function(){
				return false;
			});
		}   

	});
}
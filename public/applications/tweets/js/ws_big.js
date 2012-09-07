
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
		if(response.kind == "stats"){
			$("#mobile_count").html(response.mobiles);
		} else if(response.kind == "getItems"){
			var answer = JSON.stringify
			({
				"kind":"itemsOnScreen",
				"app": "twitter",
				"displayID":  displayID,
				"reqID": response.reqID,
				"data":  last,
			});
			websocket.send(answer);
		} else if (response.kind == "newhashtag"){
			hashtags.push(response.hashtag);
			console.log(hashtags);
		}
	};
	
	websocket.onerror = function(evt) { 
		console.log(evt.data); 
	}; 
	
	setInterval(function(){findNewTweets();},5000);
	$("#hashtag").html("#"+tag);
		
});	

function findNewTweets(){
	if(last.length > 10){
		last = new Array();
	}
	if(nextpage == undefined){
		if(hashtags.length == 0){
			console.log("old");
			nextpage = refreshurl + "&rpp=4";
		} else {
			console.log(hashtags[counter]);
			nextpage = "?q=%23" + hashtags[counter] + "&rpp=4";
			$("#hashtag").html(hashtags[counter]);
			counter++;
		}
	}
	$.ajax({
		url: 'http://search.twitter.com/search.json' + nextpage,
		dataType: 'jsonp',
		success: function(data, textStatus, xhr) {
			nextpage = data.next_page;
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
		
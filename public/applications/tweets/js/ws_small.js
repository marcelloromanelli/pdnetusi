
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
		console.log(response);
		if(response.kind == "stats"){
			$("#mobile_count").html(response.mobiles);
		} else if (response.kind == "newhashtag"){
			hashtags.push(response.hashtag);
			console.log(hashtags);
		}
	};

	websocket.onerror = function(evt) { 
		console.log(evt.data); 
	}; 
	
	setInterval(function(){findNewTweets();},15000);
	$("#hashtag").html("#"+tag);
		
});	
		
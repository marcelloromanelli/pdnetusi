
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
			hashtags.put(response.hashtag);
			console.log(hashtags);
		}
	};
	
	websocket.onerror = function(evt) { 
		console.log(evt.data); 
	}; 
	
	setInterval(function(){findNewTweets();},5000);
	$("#hashtag").html("#"+tag);
		
});	
		
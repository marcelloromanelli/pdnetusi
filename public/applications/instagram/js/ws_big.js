var hashtags = new Array();

$(function(){
	displayID = getUrlVars()["id"];
	var WS = WebSocket;
	var wsUri = "ws://pdnet.inf.unisi.ch:9000/instagram/socket";
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
		if(response.kind == "getItems"){
			var answer = JSON.stringify
			({
				"kind":"itemsOnScreen",
				"app": "instagram",
				"displayID":  displayID,
				"reqID": response.reqID,
				"username": response.username,
				"data":  last,
			});
			websocket.send(answer);
		} else if (response.kind == "newhashtag"){
			if($.inArray(response.hashtag, hashtags) == -1){
				hashtags.push(response.hashtag);
				setInterval(function(){findPhotosWithTag(response.hashtag, true);}, 10000);
			}
		}
	};

	websocket.onerror = function(evt) { 
		console.log(evt.data); 
	}; 
});

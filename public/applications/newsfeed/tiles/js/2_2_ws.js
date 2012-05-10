var queue;
var count = 1;

$(function() { 
	output = $("#output"); 
	var WS = window['MozWebSocket'] ? MozWebSocket : WebSocket
	var wsUri = "ws://localhost:9000/newsfeed/socket";
	websocket = new WS(wsUri); 
	websocket.onopen = function(evt) { 
		console.log("CONNECTED"); 
		var hi = JSON.stringify
		({
			"kind":"tileAvailable",
			"displayID":  getUrlVars()["id"],
			"width": 2,
			"height":2
		});
		websocket.send(hi);
		console.log(hi);
	}; 
	
	websocket.onclose = function(evt) { 
		console.log("DISCONNECTED"); 
	};
	
	websocket.onmessage = function(evt) { 
		var response = jQuery.parseJSON(evt.data);
		queue = response.feeds;
		$("#news").html(response.feeds[0]);
		var timerId = setInterval(timerMethod, 5000); 
	};

	websocket.onerror = function(evt) { 
		console.log(evt.data); 
	}; 
  	
  	function timerMethod() {
		var newsFeedTile = $("#news");
		newsFeedTile.html(queue[count%queue.length]).hide().fadeIn('slow');;	
		count++;
	}
});

	
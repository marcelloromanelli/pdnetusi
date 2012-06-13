var queue;
var count = 1;

$(function() { 
	output = $("#output"); 
	var WS = window['MozWebSocket'] ? MozWebSocket : WebSocket
	var wsUri = "ws://pdnet.inf.unisi.ch:9000/photostream/socket";
	websocket = new WS(wsUri); 
	websocket.onopen = function(evt) { 
		console.log("CONNECTED"); 
		var hi = JSON.stringify
		({
			"kind":"tileAvailable",
			"displayID":  getUrlVars()["id"],
			"width": 8,
			"height":5
		});
		websocket.send(hi);
		console.log(hi);
	}; 
	
	websocket.onclose = function(evt) { 
		console.log("DISCONNECTED"); 
	};
	
	websocket.onmessage = function(evt) { 
		var response = jQuery.parseJSON(evt.data);
	};

	websocket.onerror = function(evt) { 
		console.log(evt.data); 
	}; 
  	

});

	
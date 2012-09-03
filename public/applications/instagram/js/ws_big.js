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
				"data":  last,
			});
			websocket.send(answer);
		}
	};

	websocket.onerror = function(evt) { 
		console.log(evt.data); 
	}; 
});
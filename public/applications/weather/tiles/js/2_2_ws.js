$(function() { 
	output = $("#output"); 
	var WS = window['MozWebSocket'] ? MozWebSocket : WebSocket
	var wsUri = "ws://localhost:9000/weather/socket";
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
		if (response.kind == "forecast"){
			var condition = lowerWithoutSpaces(response.today[0]);
			$('#weather_img').attr('src','img/' + condition + '.png');
			$('#temperature').html(response.today[2] + "&ordm; C");
			$('#location').html(response.today[6]);
		}
		 // $('body').append(evt.data);
		console.log("SERVER APP ANSWER: ");
		console.log(response) ;
	};

	websocket.onerror = function(evt) { 
		console.log(evt.data); 
	}; 
  	
});
// ACCESS THE IFRAME THAT CONTAINS THIS CODE
// GET TILEID

$(function() { 
	var parentWindow = window.parent.document.getElementById(window.name);
	var tileID = $(parentWindow).attr("id").split("_")[1];
	displayID = getUrlVars()["id"]
	var WS = window['MozWebSocket'] ? MozWebSocket : WebSocket
	var wsUri = "ws://pdnet.inf.unisi.ch:9000/weather/socket";
	var websocket = new WS(wsUri); 
	websocket.onopen = function(evt) { 
		console.log("--- TILE CONNECTION ---"); 
		var hi = JSON.stringify
		({
			"kind":"tileAvailable",
			"displayID":  displayID,
			"width": 2,
			"height":2
		});
		websocket.send(hi);
		console.debug(hi);
		console.log("--- TILE CONNECTION FINISHED ---"); 

		console.log("\n\nLOADING DEFAULTS FOR " + tileID);
		loadDefaultParameters(tileID,websocket);
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
		console.log("\nSERVER APP ANSWER: ");
		console.log(response) ;
	};

	websocket.onerror = function(evt) { 
		console.log(evt.data); 
	}; 

});
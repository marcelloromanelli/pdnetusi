// TEST
$(function() { 
	displayID = getUrlVars()["id"]
	var WS = WebSocket;
	var wsUri = "ws://pdnet.inf.unisi.ch:9000/weather/socket";
	websocket = new WS(wsUri); 
	websocket.onopen = function(evt) { 
		console.log("CONNECTED"); 
		sendHiMessage();
	}; 

	websocket.onclose = function(evt) { 
		console.log("DISCONNECTED"); 
	};

	websocket.onmessage = function(evt) {
		
		var response = jQuery.parseJSON(evt.data);
		$("#first_location").html(response.location.city);
		$("#first_current_temp").html(response.condition.temperature + "¼");
		$("#first_humidity").html(response.atmosphere.humidity);
		$("#first_wind_speed").html(response.wind.speed);
		$("#first_wind_direction").html(response.wind.direction);
		$("#first_maxtemp").html(response.forecast[0].high_temperature + "¼");
		$("#first_mintemp").html(response.forecast[0].low_temperature + "¼");

		console.log("SERVER APP ANSWER: ");
		console.log(response) ;
	};

	websocket.onerror = function(evt) { 
		console.log(evt.data); 
	}; 

});


/* Send initial message to the websocket of the
 * corresponding app in order to notify its availability.
 */
function sendHiMessage(){
	var hi = JSON.stringify
	({
		"kind":"appReady",
		"displayID":  displayID,
		"size": "small"
	});
	websocket.send(hi);
}

function loadDefaultParameters(tileID){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET","http://pdnet.inf.unisi.ch:9000/assets/displays/list.xml" ,false);
	xmlhttp.send();
	console.log("DISPLAY ID:" + displayID);
	var xmlDoc=xmlhttp.responseXML;
	var displays = xmlDoc.getElementsByTagName("display");
	layoutID = null;
	for(var j=0; j<displays.length; j++){
		var currentDisplay = displays[j];
		var currentDisplayID = currentDisplay.getElementsByTagName("id")[0].childNodes[0].nodeValue;
		if (currentDisplayID == displayID){
			layoutID =  currentDisplay.getElementsByTagName("layoutID")[0].childNodes[0].nodeValue;
			break;
		}
	}



	xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET","http://pdnet.inf.unisi.ch:9000/assets/displays/layouts/"+layoutID+".xml" ,false);
	xmlhttp.send();
	xmlDoc=xmlhttp.responseXML;
	var tiles = xmlDoc.getElementsByTagName("tile");
	for(var i=0; i<tiles.length; i++)
	{
		var currentTile = tiles[i];
		var currentTileID = currentTile.getElementsByTagName("id")[0].childNodes[0].nodeValue;
		if (currentTileID == tileID){
			var params = currentTile.getElementsByTagName("parameter");
			for(var j=0; j<params.length;j++){
				var paramName = params[j].childNodes[0].nodeValue;
				var paramValue = params[j].getAttribute("value");
				var defaultRequest = JSON.stringify
				({
					"kind":"defaultRequest",
					"displayID":  displayID,
					"preference" : paramValue
				});
				websocket.send(defaultRequest);
				console.log("SENDING DEFAULT REQUEST ");
				console.log(defaultRequest);

			}
		}
	}
}

function getUrlVars()
{
	var vars = [], hash;
	var hashes = window.parent.location.href.slice(window.parent.location.href.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++)
	{
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}

function lowerWithoutSpaces(input){
    return input.toLowerCase().split(' ').join('');
}
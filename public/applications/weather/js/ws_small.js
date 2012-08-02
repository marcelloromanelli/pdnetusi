status = new Array(true, true, true);

$(function() { 
	displayID = getUrlVars()["id"];
	var WS = WebSocket;
	var wsUri = "ws://pdnet.inf.unisi.ch:9000/weather/socket";
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
		
		console.log(findFree());
		console.log("SERVER APP ANSWER: ");
		console.log(response) ;
	};

	websocket.onerror = function(evt) { 
		console.log(evt.data); 
	}; 

});


function findFree(){
	for (var idx in status) {
		console.log(status[idx]);
		if(status[idx]){
			status[idx] = false;
			return idx;
		} else {
			console.log("ERROR: TO MANY REQUESTS");
		}
	}
}

function updateFirst(evt){
	$("#first_location").html(response.location.city);
	$("#first_current_temp").html(response.condition.temperature + "º");
	$("#first_humidity").html(response.atmosphere.humidity);
	$("#first_wind_speed").html(response.wind.speed);
	$("#first_wind_direction").html(response.wind.direction);
	$("#first_maxtemp").html(response.forecast[0].high_temperature + "º");
	$("#first_mintemp").html(response.forecast[0].low_temperature + "º");
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
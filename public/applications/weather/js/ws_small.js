var first=true;
var second=true;
var third=true;

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
		findFree(response);
		
//		console.log("SERVER APP ANSWER: ");
//		console.log(response) ;
	};

	websocket.onerror = function(evt) { 
		console.log(evt.data); 
	}; 

});


function findFree(response){
	if(first){
		updateFirst(response);
		first = false;
	} else if (second){
		console.log("second");
		second = false;
	} else if (third) {
		console.log("third");
		third = false;
	} else {
		console.log("error");
	}
}

function updateFirst(response){
	$("#first_location").html(response.location.city);
	$("#first_current_temp").html(response.condition.temperature + "º");
	$("#first_humidity").html(response.atmosphere.humidity);
	$("#first_wind_speed").html(response.wind.speed);
	$("#first_wind_direction").html(response.wind.direction);
	$("#first_maxtemp").html(response.forecast[0].high_temperature + "º");
	$("#first_mintemp").html(response.forecast[0].low_temperature + "º");
}

function updateSecond(response){
	$("#second_location").html(response.location.city);
	$("#second_current_temp").html(response.condition.temperature + "º");
	$("#second_maxtemp").html(response.forecast[0].high_temperature + "º");
	$("#second_mintemp").html(response.forecast[0].low_temperature + "º");
}

function updateThird(response){
	$("#third_location").html(response.location.city);
	$("#third_current_temp").html(response.condition.temperature + "º");
	$("#third_maxtemp").html(response.forecast[0].high_temperature + "º");
	$("#third_mintemp").html(response.forecast[0].low_temperature + "º");
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
var first=true;
var firstInterval;

var second=true;
var secondInterval;

var third=true;
var thirdIterval;


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
			"size": "big"
		});
		websocket.send(hi);
	}; 

	websocket.onclose = function(evt) { 
		console.log("DISCONNECTED"); 
	};

	websocket.onmessage = function(evt) {
		var response = jQuery.parseJSON(evt.data);
		findFree(response);
		console.log(response);
	};

	websocket.onerror = function(evt) { 
		console.log(evt.data); 
	}; 

});


function findFree(response){
	if(first){
		updateFirst(response);
		first = false;
		firstInterval=setInterval(function(){freeSpace(); clearInterval(firstInterval); first=true;},5000);
	} else if (second){
		updateSecond(response);
		second = false;
		secondInterval=setInterval(function(){freeSpace();clearInterval(secondInterval);second=true;},5000);
	} else if (third) {
		updateThird(response);
		third = false;
		thirdInterval=setInterval(function(){freeSpace();clearInterval(thirdInterval);third=true;},5000);
	} else {
		console.log("error");
	}
}

function freeSpace(){
	var free = JSON.stringify
	({
		"kind":"free",
		"displayID":  displayID,
	});
	websocket.send(free);
}

function updateFirst(response){
	$("#first_location").html(response.location.city);
	$("#first_current_temp").html(response.condition.temperature + "¼");
	$("#first_humidity").html(response.atmosphere.humidity);
	$("#first_wind_speed").html(response.wind.speed);
	$("#first_wind_direction").html(response.wind.direction);
	$("#first_maxtemp").html(response.forecast[0].high_temperature + "¼");
	$("#first_mintemp").html(response.forecast[0].low_temperature + "¼");
	
}

function updateSecond(response){
	$("#second_location").html(response.location.city);
	$("#second_current_temp").html(response.condition.temperature + "¼");
	$("#second_maxtemp").html(response.forecast[0].high_temperature + "¼");
	$("#second_mintemp").html(response.forecast[0].low_temperature + "¼");
}

function updateThird(response){
	$("#third_location").html(response.location.city);
	$("#third_current_temp").html(response.condition.temperature + "¼");
	$("#third_maxtemp").html(response.forecast[0].high_temperature + "¼");
	$("#third_mintemp").html(response.forecast[0].low_temperature + "¼");
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
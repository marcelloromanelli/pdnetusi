var first=true;
var firstInterval;

var second=true;
var secondInterval;

var third=true;
var thirdIterval;

var timeout = 30000;

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
		firstInterval=setTimeout(function(){freeSpace(); clearTimeout(firstInterval); first=true;},timeout);
	} else if (second){
		updateSecond(response);
		second = false;
		secondInterval=setTimeout(function(){freeSpace();clearTimeout(secondInterval);second=true;},timeout);
	} else if (third) {
		updateThird(response);
		third = false;
		thirdInterval=setTimeout(function(){freeSpace();clearTimeout(thirdInterval);third=true;},timeout);
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

	$("#first_city").html(response.location.city);
	$("#first_img").attr("src","css/icons/"+response.condition.code +".png")
	$("#first_location").html(response.location.city);
	$("#first_current_temp").html(response.condition.temperature + "º");
	$("#first_humidity").html(response.atmosphere.humidity);
	$("#first_wind_speed").html(response.wind.speed);
	$("#first_wind_direction").html(response.wind.direction);
	$("#first_maxtemp").html(response.forecast[0].high_temperature + "º");
	$("#first_mintemp").html(response.forecast[0].low_temperature + "º");

	for(var i = 2; i < 6; i++){
		$("#first_d" + i + "_day_name").html(response.forecast[i-1].day);
		$("#first_d" + i + "_desc").html(response.forecast[i-1].condition);
		$("#first_d" + i + "_maxtemp").html(response.forecast[i-1].high_temperature + "º");
		$("#first_d" + i + "_mintemp").html(response.forecast[i-1].low_temperature + "º");
	}

}

function updateSecond(response){
	$("#second_city").html(response.location.city);
	$("#second_img").attr("src","css/icons/"+response.condition.code +".png")
	$("#second_location").html(response.location.city);
	$("#second_current_temp").html(response.condition.temperature + "º");
	$("#second_humidity").html(response.atmosphere.humidity);
	$("#second_wind_speed").html(response.wind.speed);
	$("#second_wind_direction").html(response.wind.direction);
	$("#second_maxtemp").html(response.forecast[0].high_temperature + "º");
	$("#second_mintemp").html(response.forecast[0].low_temperature + "º");

	for(var i = 2; i < 6; i++){
		$("#second_d" + i + "_day_name").html(response.forecast[i-1].day);
		$("#second_d" + i + "_desc").html(response.forecast[i-1].condition);
		$("#second_d" + i + "_maxtemp").html(response.forecast[i-1].high_temperature + "º");
		$("#second_d" + i + "_mintemp").html(response.forecast[i-1].low_temperature + "º");
	}
}

function updateThird(response){
	$("#third_city").html(response.location.city);
	$("#third_img").attr("src","css/icons/"+response.condition.code +".png")
	$("#third_location").html(response.location.city);
	$("#third_current_temp").html(response.condition.temperature + "º");
	$("#third_humidity").html(response.atmosphere.humidity);
	$("#third_wind_speed").html(response.wind.speed);
	$("#third_wind_direction").html(response.wind.direction);
	$("#third_maxtemp").html(response.forecast[0].high_temperature + "º");
	$("#third_mintemp").html(response.forecast[0].low_temperature + "º");
	
	for(var i = 2; i < 6; i++){
		$("#third_d" + i + "_day_name").html(response.forecast[i-1].day);
		$("#third_d" + i + "_desc").html(response.forecast[i-1].condition);
		$("#third_d" + i + "_maxtemp").html(response.forecast[i-1].high_temperature + "º");
		$("#third_d" + i + "_mintemp").html(response.forecast[i-1].low_temperature + "º");
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
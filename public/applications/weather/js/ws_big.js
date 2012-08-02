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

	for(var i = 1; i < 6; i++){
		$("#first_d" + i + "_day_name").html(response.forecast[i-1].day);
		$("#first_d" + i + "_maxtemp").html(response.forecast[i-1].high_temperature + "º");
		$("#first_d" + i + "_mintemp").html(response.forecast[i-1].low_temperature + "º");
	}

}

function updateSecond(response){
	for(var i = 1; i < 6; i++){
		$("#second_d" + i + "_day_name").html(response.forecast[i-1].day);
		$("#second_d" + i + "_maxtemp").html(response.forecast[i-1].high_temperature + "º");
		$("#second_d" + i + "_mintemp").html(response.forecast[i-1].low_temperature + "º");
	}
}

function updateThird(response){
	for(var i = 1; i < 6; i++){
		$("#third_d" + i + "_day_name").html(response.forecast[i-1].day);
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
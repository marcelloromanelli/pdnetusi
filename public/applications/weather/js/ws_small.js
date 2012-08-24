var first=true;
var firstLocation;
var firstInterval;

var second=true;
var secondLocation;
var secondInterval;

var third=true;
var thirdLocation;
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
		console.log(response) ;
	};

	websocket.onerror = function(evt) { 
		console.log(evt.data); 
	}; 

});

function updateFirst(response){
	$("#first_img").attr("src","css/icons/"+response.condition.code +".png")
	$("#first_location").html(response.location.city);
	$("#first_current_temp").html(response.condition.temperature + "º");
	$("#first_humidity").html(response.atmosphere.humidity);
	$("#first_wind_speed").html(response.wind.speed);
	$("#first_wind_direction").html(response.wind.direction);
	$("#first_maxtemp").html(response.forecast[0].high_temperature + "º");
	$("#first_mintemp").html(response.forecast[0].low_temperature + "º");
	
}

function updateSecond(response){
	$("#second_img").attr("src","css/small_icons/"+response.condition.code +".png")
	$("#second_location").html(response.location.city);
	$("#second_current_temp").html(response.condition.temperature + "º");
	$("#second_maxtemp").html(response.forecast[0].high_temperature + "º");
	$("#second_mintemp").html(response.forecast[0].low_temperature + "º");
}

function updateThird(response){
	$("#third_img").attr("src","css/small_icons/"+response.condition.code +".png")
	$("#third_location").html(response.location.city);
	$("#third_current_temp").html(response.condition.temperature + "º");
	$("#third_maxtemp").html(response.forecast[0].high_temperature + "º");
	$("#third_mintemp").html(response.forecast[0].low_temperature + "º");
}
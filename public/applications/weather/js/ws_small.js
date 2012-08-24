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
	};

	websocket.onerror = function(evt) { 
		console.log(evt.data); 
	}; 

});

function updateFirst(response,cityname){
	var city = $("#first");
	city.animate({"margin-left": "-530px"},'slow',function(){
		$("#first_img").attr("src","css/icons/"+response.condition.code +".png");
		freeCity($("#first_location").html());
		$("#first_location").html(cityname);
		$("#first_current_temp").html(response.condition.temperature + "º");
		$("#first_humidity").html(response.atmosphere.humidity);
		$("#first_wind_speed").html(response.wind.speed);
		$("#first_wind_direction").html(response.wind.direction);
		$("#first_maxtemp").html(response.forecast[0].high_temperature + "º");
		$("#first_mintemp").html(response.forecast[0].low_temperature + "º");
	});
	city.css("display","inline-block");
	city.animate({"margin-left": 25},'fast',function(){
		city.effect("bounce", {direction:'left', times:3 }, 300);
	});	
}

function updateSecond(response,cityname){
	var city = $($(".other").get(0));
	city.animate({"margin-left": "-530px"},'slow',function(){
		$("#second_img").attr("src","css/small_icons/"+response.condition.code +".png")
		freeCity($("#second_location").html());
		$("#second_location").html(cityname);
		$("#second_current_temp").html(response.condition.temperature + "º");
		$("#second_maxtemp").html(response.forecast[0].high_temperature + "º");
		$("#second_mintemp").html(response.forecast[0].low_temperature + "º");
	});

	city.animate({"margin-left": 25},'fast');
	city.effect("bounce", {direction:'left', times:3 }, 300);
}


function updateThird(response,cityname){
	var city = $($(".other").get(1));
	city.animate({"margin-left": "-530px"},'slow',function(){
		$("#third_img").attr("src","css/small_icons/"+response.condition.code +".png")
		freeCity($("#third_location").html());
		$("#third_location").html(cityname);
		$("#third_current_temp").html(response.condition.temperature + "º");
		$("#third_maxtemp").html(response.forecast[0].high_temperature + "º");
		$("#third_mintemp").html(response.forecast[0].low_temperature + "º");
	});
	city.animate({"margin-left": 25},'fast');
	city.effect("bounce", {direction:'left', times:3 }, 300);
}
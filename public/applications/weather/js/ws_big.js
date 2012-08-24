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


function updateFirst(response,cityname){

	var city = $($(".city").get(0));
	var original = city.css("margin-top");
	city.animate({"margin-top": "-749px"},'slow',function(){

		$("#first_city").html(cityname);

		$("#first_img").attr("src","css/icons/"+response.condition.code +".png");
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

	});
	
	city.animate({"margin-top": original},'fast');
	city.effect("bounce", { times:3 }, 300);
}

function updateSecond(response,cityname){
	var city = $($(".city").get(1));
	var original = city.css("margin-top");
	city.animate({"margin-top": "-749px"},'fast');

	$("#second_city").html(cityname);

	$("#second_img").attr("src","css/icons/"+response.condition.code +".png");
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

	city.animate({"margin-top": original},'slow');

}

function updateThird(response,cityname){
	var city = $($(".city").get(2));
	var original = city.css("margin-top");
	city.animate({"margin-top": "-749px"},'fast');

	$("#third_city").html(cityname);

	$("#third_img").attr("src","css/icons/"+response.condition.code +".png")
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

	city.animate({"margin-top": original},'slow');
}
$(function() { 
	output = $("#output"); 
	var WS = window['MozWebSocket'] ? MozWebSocket : WebSocket
	var wsUri = "ws://localhost:9000/weather/socket";
	websocket = new WS(wsUri); 
	websocket.onopen = function(evt) { 
		console.log("CONNECTED"); 
		var hi = JSON.stringify
		({
			"kind":"tileAvailable",
			"displayID":  getUrlVars()["id"],
			"width": 4,
			"height":4
		});
		websocket.send(hi);
		console.log(hi);
	}; 
	
	websocket.onclose = function(evt) { 
		console.log("DISCONNECTED"); 
	};
	
	websocket.onmessage = function(evt) { 
		var response = jQuery.parseJSON(evt.data);
		
		var today = response.today;
		$('#weather_img_today').attr('src','img/' + lowerWithoutSpaces(today[0]) + '.png');
		$('#info').append("<h6>Now in " + today[6] + "<h6>");
		$('#info').append("<h6>" + today[2] + "&ordm; C" + "</h6>");
		$('#info').append("<h6>" + today[3] + "</h6>");
		$('#info').append("<h6>" + today[5] + "</h6>");
		
		
		var day0 = response.day0;
		$("#name_day0").html(day0[0]);		
		$('#weather_img_day0').attr('src','img/' + lowerWithoutSpaces(day0[4]) + '.png');
		$("#desc_day0").html(day0[4]);		
				
		var day1 = response.day1;
		$("#name_day1").html(day1[0]);		
		$('#weather_img_day1').attr('src','img/' + lowerWithoutSpaces(day1[4]) + '.png');
		$("#desc_day1").html(day1[4]);		
		
		var day2 = response.day2;
		$("#name_day2").html(day2[0]);		
		$('#weather_img_day2').attr('src','img/' + lowerWithoutSpaces(day2[4]) + '.png');
		$("#desc_day2").html(day2[4]);		
		
		
		var day3 = response.day3;
		$("#name_day3").html(day3[0]);		
		$('#weather_img_day3').attr('src','img/' + lowerWithoutSpaces(day3[4]) + '.png');
		$("#desc_day3").html(day3[4]);		
		
		
		console.log(response) ;
	};

	websocket.onerror = function(evt) { 
		console.log(evt.data); 
	}; 
  	
});
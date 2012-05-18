$(function() { 
	var parentWindow = window.parent.document.getElementById(window.name);
	var tileID = $(parentWindow).attr("id").split("_")[1];
	displayID = getUrlVars()["id"];
	var WS = window['MozWebSocket'] ? MozWebSocket : WebSocket
	var wsUri = "ws://pdnet.inf.unisi.ch:9000/weather/socket";
	websocket = new WS(wsUri); 
	websocket.onopen = function(evt) { 
		console.log("--- TILE CONNECTION ---"); 
		var hi = JSON.stringify
		({
			"kind":"tileAvailable",
			"displayID":  displayID,
			"width": 4,
			"height":4
		});
		websocket.send(hi);
		console.debug(hi);
		console.log("--- TILE CONNECTION FINISHED ---"); 

		console.log("\n\nLOADING DEFAULTS FOR " + tileID);
		loadDefaultParameters(tileID);
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


function loadDefaultParameters(tileID){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET","http://pdnet.inf.unisi.ch:9000/assets/displays/list.xml" ,false);
	xmlhttp.send();
	var xmlDoc=xmlhttp.responseXML;
	var displays = xmlDoc.getElementsByTagName("display");
	layoutID = null;
	for(var j=0; j<displays.length; j++){
		var currentDisplay = displays[j];
		var currentDisplayID = currentDisplay.getElementsByTagName("id")[0].childNodes[0].nodeValue;
		console.log(currentDisplayID);
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

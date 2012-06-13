$(function() { 
	var WS = window['MozWebSocket'] ? MozWebSocket : WebSocket
	var wsUri = "ws://pdnet.inf.unisi.ch:9000/photostream/socket";
	displayID = getUrlVars()["id"];
	websocket = new WS(wsUri); 
	websocket.onopen = function(evt) { 
		console.log("CONNECTED"); 
		var hi = JSON.stringify
		({
			"kind":"tileAvailable",
			"displayID":  displayID,
			"width": 8,
			"height":5
		});
		websocket.send(hi);
		console.log(hi);
		var tileID = $(parent.document.getElementById(window.name)).attr("id").split("_")[1];
		loadDefaultParameters(tileID);
	}; 
	
	websocket.onclose = function(evt) { 
		console.log("DISCONNECTED"); 
	};
	
	websocket.onmessage = function(evt) { 
		var response = jQuery.parseJSON(evt.data);
		console.log(response);
		$("#photos").show();
	};

	websocket.onerror = function(evt) { 
		console.log(evt.data); 
	}; 
  	

});

function loadDefaultParameters(tileID){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET","http://pdnet.inf.unisi.ch:9000/assets/displays/list.xml" ,false);
	xmlhttp.send();
	console.log("DISPLAY ID:" + displayID);
	var xmlDoc=xmlhttp.responseXML;
	var displays = xmlDoc.getElementsByTagName("display");
	layoutID = null;
	for(var j=0; j<displays.length; j++){
		var currentDisplay = displays[j];
		var currentDisplayID = currentDisplay.getElementsByTagName("id")[0].childNodes[0].nodeValue;
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
				$("body").html("<img src='" + paramValue + "' />");
			}
		}
	}
}

	
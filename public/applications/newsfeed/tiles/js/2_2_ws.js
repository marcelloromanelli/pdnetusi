var queue;
var count = 1;

$(function() { 
	output = $("#output"); 
	var WS = window['MozWebSocket'] ? MozWebSocket : WebSocket
	var wsUri = "ws://pdnet.inf.unisi.ch:9000/newsfeed/socket";
	var tileID = $(parent.document.getElementById(window.name)).attr("id").split("_")[1];
	displayID = getUrlVars()["id"];
	websocket = new WS(wsUri); 
	websocket.onopen = function(evt) { 
		sendHiMessage();
		loadDefaultParameters(tileID);
	}; 
	
	websocket.onclose = function(evt) { 
		console.log("DISCONNECTED"); 
	};
	
	websocket.onmessage = function(evt) { 
		var response = jQuery.parseJSON(evt.data);
		queue = response.feeds;
		$("#news").html(response.feeds[0]);
		var timerId = setInterval(timerMethod, 5000);
		if (response.kind == "mobileAnswer"){
			setTimeout("sendHiMessage();",5000);
		}
	};

	websocket.onerror = function(evt) { 
		console.log(evt.data); 
	}; 
  	
	
	function sendHiMessage(){
		var hi = JSON.stringify
		({
			"kind":"tileAvailable",
			"displayID":  displayID,
			"width": 2,
			"height":2
		});
		websocket.send(hi);
		console.log("SENDING HI MESSASGE");
		console.log(hi);
		console.log("\n\n");

	}
	
  	function timerMethod() {
		var newsFeedTile = $("#news");
		newsFeedTile.html(queue[count%queue.length]).hide().fadeIn('slow');;	
		count++;
	}
  	
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
  					var array = new Array();
  					array[0] = paramValue;
  					var defaultRequest = JSON.stringify
  					({
  						"kind":"defaultRequest",
  						"displayID":  displayID,
  						"preference" : array
  					});
  					websocket.send(defaultRequest);
  					console.log("SENDING DEFAULT REQUEST ");
  					console.log(defaultRequest);

  				}
  			}
  		}
  	}
});



	
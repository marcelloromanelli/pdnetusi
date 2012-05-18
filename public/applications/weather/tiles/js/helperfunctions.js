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


function loadDefaultParameters(tileID,websocket){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET","http://pdnet.inf.unisi.ch:9000/assets/displays/list.xml" ,false);
	xmlhttp.send();
	var xmlDoc=xmlhttp.responseXML;
	if (!xmlDoc){
		console.log("list.xml was not fetched correctly!")
		return false;
	}
	

	var displays = xmlDoc.getElementsByTagName("display");
	var layoutID = null;
	for(var j=0; j<displays.length; j++){
		var currentDisplay = displays[j];
		var currentDisplayID = currentDisplay.getElementsByTagName("id")[0].childNodes[0].nodeValue;
		console.log(currentDisplayID);
		if (currentDisplayID == displayID){
			layoutID =  currentDisplay.getElementsByTagName("layoutID")[0].childNodes[0].nodeValue;
			break;
		}
	}
	
	if(layoutID == null){
		console.log("unable to find layoutID");
		return false;
	}
	
	xmlDoc = null;
	xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET","http://pdnet.inf.unisi.ch:9000/assets/displays/layouts/"+layoutID+".xml" ,false);
	xmlhttp.send();
	xmlDoc=xmlhttp.responseXML;
	if (!xmlDoc){
		console.error(layoutID + ".xml was not fetched correctly!")
		return false;
	}
	
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
				console.log("\nSENDING DEFAULT REQUEST TO THE SERVER");
				console.log(defaultRequest);
				
			}
		}
	}
}

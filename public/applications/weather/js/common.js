
function findFree(response){
	if(first){
		updateFirst(response.forecast,response.original_request);
		first = false;
		firstLocation = response.original_request; 
		firstInterval=setTimeout(function(){freeSpace(firstLocation); clearTimeout(firstInterval); first=true;},timeout);
	} else if (second){
		updateSecond(response.forecast,response.original_request);
		second = false;
		secondLocation = response.original_request; 
		secondInterval=setTimeout(function(){freeSpace(secondLocation);clearTimeout(secondInterval);second=true;},timeout);
	} else if (third) {
		updateThird(response.forecast,response.original_request);
		third = false;
		thirdLocation = response.original_request; 
		thirdInterval=setTimeout(function(){freeSpace(thirdLocation);clearTimeout(thirdInterval);third=true;},timeout);
	} else {
		console.log("error");
	}
}

function freeSpace(location){
	var free = JSON.stringify
	({
		"kind":"free",
		"displayID":  displayID,
		"location": location
	});
	websocket.send(free);
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
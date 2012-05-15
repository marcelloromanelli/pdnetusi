function getBaseURL () {
   return location.protocol + "//" + location.hostname + 
      (location.port && ":" + location.port) + "/";
}

function xmlToDOM(url){
	if (window.XMLHttpRequest)
	  {// code for IE7+, Firefox, Chrome, Opera, Safari
	  xmlhttp=new XMLHttpRequest();
	  }
	else
	  {// code for IE6, IE5
	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	  }
	xmlhttp.open("GET",url,false);
	xmlhttp.send();
	return xmlhttp.responseXML;
}

// Takes a string  and convert it
// to lower case without spaces
function lowerWithoutSpaces(input){
    return input.toLowerCase().split(' ').join('');
}

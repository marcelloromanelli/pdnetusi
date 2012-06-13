var SIZE = 120;

function createApp(appName, id, startX, startY, width, height,htmlSource){
	var tile = $('<iframe class="application">');
	tile.addClass(appName);
	
	tile.attr('src',htmlSource);
	tile.attr('id',appName + "_" + id);
	
	tile.css({
		position: 'absolute',
		left: startX*SIZE+'px',
		top: startY*SIZE+'px',
		width: width*SIZE+'px',
		height: width*SIZE+'px',
		border: "0"
	});	

	tile.css('background-color','red');
		
//	tile.data({ 
//		tileWidth : width, 
//		tileHeight : height,
//		tileID: id
//	});


	$('.content').append(tile);
}


function insertContent(appName)
{
	var appSet = $( '.' + appName);
	var freeTile = null;
	appSet.each(function(){
		var current = $(this);
		var currentContentLength = current.html().length;
		// find the first free block
		if (currentContentLength == 0)
		{
			freeTile = current;
			return false;
		} 
	}
	)
	return freeTile;
}


function getAvailableSizes(appName)
{
	var appSet = $( '.' + appName);
	var sizes = new Array();
	appSet.each(function(){
		var tileSize = new Object();
		var currentTile = $(this);
		tileSize.width = currentTile.data('tileWidth');
		tileSize.height = currentTile.data('tileHeight');
		if(!containsSizes(tileSize,sizes)){
			sizes.push(tileSize);
		}
	});
	return sizes;
}

function containsSizes(tileSize, sizes) {
	var i;
	for (i = 0; i < sizes.length; i++) {
		if (sizes[i].width == tileSize.width && sizes[i].height == tileSize.height) {
			return true;
		}
	}

	return false;
}


function randOrd(){
	return (Math.round(Math.random())-0.5); 
}


var ids = new Array();
var enlarged = 0;
var last = new Array(); 
var toInsert = new Array();

$(function(){

	$('#container').isotope({
		itemSelector : '.item',
		layoutMode : 'fitRows'
	});

	findPhotosWithTag("usilugano",false);

	setInterval(function(){findPhotosWithTag("usilugano", true);}, 5000);
	setInterval(function(){findPhotosNearCoordinates(46.010868,8.958235,true);}, 10000);

	setTimeout(function(){
		setInterval(function(){
			var lastImg = $(toInsert.pop());
			if (lastImg != undefined){
				insertNewPhoto(lastImg);
			}
		}
		,5000);
	},5000);
});


function insertNewPhoto(newItem){
	console.log(newItem);
	if($(".item").length > 25){
		var toremove = $(".item").splice(-5);
		for (var index in toremove){
			var current = $(toremove[index]);
			if(current.hasClass("large")){
				enlarged--;
			}
			current.remove();
		}
		last.splice(0,5);
	}

	var imgid =  newItem.data("imgid");
	$('#container').prepend(newItem);

	newItem.load(function(){
		$('#container').isotope( 'reloadItems' ).isotope({sortBy: 'original-order',layoutMode : 'masonry'});
	});
	
	
	//LOG
	var answer = JSON.stringify
	({
		"kind":"screenInteraction",
		"action":"add",
		"imgid": imgid,
	});
	websocket.send(answer);
}

function findPhotos(address, limit){
	$.ajax({				
		url: address,
		type: 'GET',
		dataType: 'jsonp',
		success: function(response, textStatus, xhr) {
			if(response.meta.code == 400){
				console.log("API ERROR");
				return;
			}

			var inserted = 0;
			for (var i = response.data.length-1; i >= 0 ; i--){
				if(inserted == 5 && limit){
					break;
				}
				var current = response.data[i];

				var img_thumb = current.images.thumbnail.url;
				var img_low = current.images.low_resolution.url;
				var img_std = current.images.standard_resolution.url;


				var newItem = $("<div class='item' />");
				newItem.data("imgid",current.id);


				var interactions = $("<div class='interactions' />");
				interactions.hide();
				newItem.append(interactions);


				var userImgDiv = $("<div class='userImg'>");
				var userImg = $("<img>");
				userImgDiv.append(userImg);
				userImg.attr("src",current.user.profile_picture);
				userImg.css("height","80px");
				userImg.css("width","80px");
				userImgDiv.css("float","left");
				interactions.append(userImgDiv);

				var timeAgo = $("<div class='time'>")
				timeAgo.html(jQuery.timeago(new Date(1000*current.created_time)));
				interactions.append(timeAgo);

				var user = $("<div class='user' />");
				user.html(current.user.full_name);

				interactions.append(user);


				newItem.click(photoClicked);

				newItem.data("std",img_std);

				var img = $("<img class='instimg' />");
				img.css("z-index","-10");
				img.css("position","fixed");
				img.width("248px");
				img.height("248px");
				img.attr("src",img_std);
				
				$.preload([img_std]);
				
				img.mousedown(function(){
					return false;
				});

				newItem.append(img);

				if(jQuery.inArray(current.id, ids) == -1){
					toInsert.push(newItem);
					ids.push(current.id);
					if(current.caption == null){
						var caption = "no caption available";
					} else {
						var caption = current.caption.text;
					}
					var stored = createObject(current.user.username, caption, current.link, img_thumb);
					last.push(stored);
					inserted++;
				} 
			}
		}   

	});
}

function photoClicked(){
	var current = $(this);

	if(enlarged > 2){
		var last = $($(".item.large").get(-1));
		last.toggleClass('large');
		last.find(".interactions").toggle();
		enlarged--;
		$("#container").isotope('reLayout');
	}

	current.toggleClass('large');
	current.find(".interactions").toggle();

	var immagine = current.find(".instimg");

	if(current.hasClass("large")){
		//LOG
		
		immagine.width("502px");
		immagine.height("502px");
		
		
		var answer = JSON.stringify
		({
			"kind":"screenInteraction",
			"action":"enlarge",
			"imgid": current.data("imgid"),
		});
		websocket.send(answer);

		var put = $(".item:first");
		if(put[0] === current[0]){
			current.insertAfter($($(".item").get(1)));
			console.log("here");
		} else {
			current.insertAfter(".item:first");
		}

		enlarged++;
	} else {
		//LOG
		immagine.width("248px");
		immagine.height("248px");
		
		var answer = JSON.stringify
		({
			"kind":"screenInteraction",
			"action":"shrink",
			"imgid": current.data("imgid"),
		});
		websocket.send(answer);

		enlarged--;
	}

	$("#container").isotope( 'reloadItems' ).isotope({sortBy: 'original-order',layoutMode : 'masonry'});

}


function createObject(title,desc,link,img){
	var obj = {};
	obj.title = title;
	obj.desc = desc;
	obj.link = link;
	obj.img = img;
	return obj;
}

function findPhotosNearCoordinates(lat, lng, limit){
	var address = 'https://api.instagram.com/v1/media/search?lat=' + lat 
	+ '&lng=' + lng 
	+'&distance=100&client_id=554c751130494dbbba66cb0a27602b07';
	findPhotos(address, limit);
}

function findPhotosWithTag(tag, limit){
	var address = 'https://api.instagram.com/v1/tags/'+ tag +'/media/recent?client_id=554c751130494dbbba66cb0a27602b07';
	findPhotos(address, limit);
}

function getUrlVars() {
	var vars = [], hash;
	var i = 0;
	var hashes = window.parent.location.href.slice(window.parent.location.href.indexOf('?') + 1).split('&');
	for(i = 0; i < hashes.length; i++)
	{
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}

function lowerWithoutSpaces(input) {
	return input.toLowerCase().split(' ').join('');
}

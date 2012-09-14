var ids = new Array();
var enlarged = 0;
var last = new Array(); 
var toInsert = new Array();

$(function(){

	$('#container').isotope({
		masonry: {
		},
		getSortData : {
			index : function( $item ) {
				return $item.index();
			}
		},
		sortBy : 'index'
	});


	findPhotosWithTag("usilugano",false);

	setInterval(function(){findPhotosWithTag("usilugano", true);}, 5000);
	setInterval(function(){findPhotosNearCoordinates(46.010868,8.958235,true);}, 10000);

	setInterval(function(){
		if (toInsert.length > 0){
			console.log("new img");
			insertNewPhoto($(toInsert.pop()));
		} else {
			console.log("no new img");
		}
	}
	,3000);
});


function insertNewPhoto(newItem){
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

	// super dirty hack
	newItem.attr("style", "position: absolute; left: 0px; top: 0px; -webkit-transform: translate3d(0px, 0px, 0px)")

	var imgid =  newItem.data("imgid");
	$('#container')
	.prepend(newItem)
	.isotope( 'addItems', newItem )
	// update sort data for all items
	.isotope( 'updateSortData', $('#container').children() )
	// sort and apply new layout
	.isotope();

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
			for (var i = 0; i < response.data.length ; i++){
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
			$($(".item").get(1)).after(current);
		} else {
			$(".item:first").after(current);
		}
		enlarged++;
		$('#container')
		.prepend(newItem)
		.isotope( 'reLayout')
		// update sort data for all items
		.isotope( 'updateSortData', $('#container').children() )
		// sort and apply new layout
		.isotope();
	} else {
		//Make sure they are really hidden
		current.removeClass('large');
		current.find(".interactions").hide();

		
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
	
	$("#container").isotope('reLayout');

}

// called after 10s that an image has been enlarged
function shrink(img){
	img.toggleClass('large');
	img.find(".interactions").toggle();
	var immagine = img.find(".instimg");

	immagine.width("248px");
	immagine.height("248px");
	$("#container").isotope('reLayout');
	
	var answer = JSON.stringify
	({
		"kind":"screenInteraction",
		"action":"shrink",
		"imgid": current.data("imgid"),
	});
	websocket.send(answer);
	$("#container").isotope('reLayout');

	enlarged--;
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

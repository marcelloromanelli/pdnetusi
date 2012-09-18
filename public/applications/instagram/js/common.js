var ids = new Array();
var enlarged = 0;
var last = new Array(); 
var toInsert = new Array();
var timeouts = new Object(); 
var recycleBin = new Array();
var mainInterval;
var default_speed = 2000;
var SPEED = default_speed;
var lastWasNew = false;
var tag = "usiwelcome"

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


	findPhotosWithTag(tag);

	setInterval(function(){findPhotosWithTag(tag);}, 5000);
	//setInterval(function(){findPhotosNearCoordinates(46.010868,8.958235,true);}, 10000);

	mainInterval = setInterval(function(){checkIfCanInsertNewPhoto()},SPEED);
});

function checkIfCanInsertNewPhoto(){
	if (toInsert.length > 0 && $(".item").length <= 20){
		SPEED = default_speed;
		insertNewPhoto($(toInsert.pop()));
		// if the last photo was recycled but a new
		// one was just inserted than slow down;
		lastWasNew = true;

	} else if($(".item").length > 20){
		var toremove = $(".item").splice(-1);
		for (var idx in toremove){
			var current = $(toremove[idx]);
			if(current.hasClass("large")){
				enlarged--;
			}
			current.find(".ribbon").hide();
			
			recycleBin.unshift(current);
			$("#container").isotope( 'remove', current);
		}
		last.splice(0,1);
	} 
	// RECYCLE MODE
	else if(toInsert.length == 0){
		// recycle or do something
		var recycled = $(recycleBin.pop());
		recycled.click(photoClicked);
		recycled.find("img").each(function(){
			$(this).mousedown(function(){
				return false;
			});
		});

		insertNewPhoto(recycled);
		if(lastWasNew){
			lastWasNew = false;
			freezeAndRestart(5000);
		}
	}
}

function freezeAndRestart(freezeTime){
	clearInterval(mainInterval);
	$('#container')
	.isotope( 'reLayout')
	.isotope( 'updateSortData', $('#container').children() )
	.isotope();

	setTimeout(function(){
		mainInterval = setInterval(function(){checkIfCanInsertNewPhoto()},SPEED);
	},freezeTime);
}


function createRibbon(text){
	var ribbon = $(
			"<div class='ribbon'>" 
			+ text +
			"</div>"
	);
	setTimeout(function(){ribbon.fadeOut();},30000);
	return ribbon;
}

function insertNewPhoto(newItem){

	// super dirty hack
	newItem.attr("style", "position: absolute; left: 0px; top: 0px; -webkit-transform: translate3d(0px, 0px, 0px)");
	var ago = new Date().getTime() - newItem.data("created_time")*1000;
	if(ago < 60000){
		newItem.append(createRibbon("new"));
	}

	var imgid =  newItem.data("imgid");
	$('#container')
	.prepend(newItem)
	.isotope( 'addItems', newItem )
	// update sort data for all items
	.isotope( 'updateSortData', $('#container').children() )
	// sort and apply new layout
	.isotope();

	//LOG
//	var answer = JSON.stringify
//	({
//	"kind":"screenInteraction",
//	"action":"add",
//	"imgid": imgid,
//	});
//	websocket.send(answer);
}

function findPhotos(address){
	$.ajax({				
		url: address,
		type: 'GET',
		dataType: 'jsonp',
		success: function(response, textStatus, xhr) {
			if(response.meta.code == 400){
				console.log("API ERROR");
				return;
			} else if(response.meta.code == 200){

				for (var i = 0; i < response.data.length ; i++){
					var current = response.data[i];

					var img_thumb = current.images.thumbnail.url;
					var img_low = current.images.low_resolution.url;
					var img_std = current.images.standard_resolution.url;


					var newItem = $("<div class='item' />");
					newItem.data("imgid",current.id);
					newItem.data("created_time",current.created_time);

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

					img.add(userImg).mousedown(function(){
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
					} 
				} // for every image 
				if(response.pagination.next_url != undefined){
					findPhotos(response.pagination.next_url);
				}
			} // if request is 200   

		}, // on success
		statusCode:{
			502: function() {
				findPhotos(address);
			}
		}
	});
}

function photoClicked(){	
	
	console.log("click");
	$(".item").mousedown(function(){
		return false;
	});

	var current = $(this);


	if(enlarged > 2){
		var last = $($(".item.large").get(-1));
		var lastimmagine = last.find(".instimg");
		last.removeClass('large');
		last.find(".interactions").hide();
		lastimmagine.width("248px");
		lastimmagine.height("248px");
		enlarged--;

	}

	current.toggleClass('large');
	current.find(".interactions").toggle();

	var immagine = current.find(".instimg");

	if(current.hasClass("large")){
		//LOG

		immagine.width("502px");
		immagine.height("502px");


//		var answer = JSON.stringify
//		({
//		"kind":"screenInteraction",
//		"action":"enlarge",
//		"imgid": current.data("imgid"),
//		});
//		websocket.send(answer);

		var put = $(".item").get(1);
		if(put === current[0]){
			$($(".item").get(4)).after(current);
		} else {
			$($(".item").get(1)).after(current);
		}
		enlarged++;

		$('#container')
		.isotope( 'reLayout')
		.isotope( 'updateSortData', $('#container').children() )
		.isotope();

		freezeAndRestart(10000);

		// store the timeout according to photoid
		timeouts[current.data("imgid")] = setTimeout(function(){shrink(current);},10000);

	} else {
		//Make sure they are really hidden
		clearTimeout(timeouts[current.data("imgid")]);
		delete timeouts[current.data("imgid")];

		current.removeClass('large');
		current.find(".interactions").hide();


		immagine.width("248px");
		immagine.height("248px");
		immagine.css("width","248px");
		immagine.css("height","248px");

//		var answer = JSON.stringify
//		({
//		"kind":"screenInteraction",
//		"action":"shrink",
//		"imgid": current.data("imgid"),
//		});
//		websocket.send(answer);

		enlarged--;
	}

	$("#container").isotope('reLayout');

	$('.item').unbind('mousedown');


}

//called after 10s that an image has been enlarged
function shrink(img){

	delete timeouts[img.data("imgid")];

	img.removeClass('large');
	img.find(".interactions").hide();
	var immagine = img.find(".instimg");

	immagine.width("248px");
	immagine.height("248px");


	$("#container").isotope('reLayout');

	var answer = JSON.stringify
	({
		"kind":"screenInteraction",
		"action":"shrink",
		"imgid": img.data("imgid"),
	});
	websocket.send(answer);

	enlarged--;

	$('#container')
	.isotope( 'reLayout')
	.isotope( 'updateSortData', $('#container').children() )
	.isotope();
}

function createObject(title,desc,link,img){
	var obj = {};
	obj.title = title;
	obj.desc = desc;
	obj.link = link;
	obj.img = img;
	return obj;
}

function findPhotosNearCoordinates(lat, lng){
	var address = 'https://api.instagram.com/v1/media/search?lat=' + lat 
	+ '&lng=' + lng 
	+'&distance=100&client_id=554c751130494dbbba66cb0a27602b07';
	findPhotos(address);
}

function findPhotosWithTag(tag){
	var address = 'https://api.instagram.com/v1/tags/'+ tag +'/media/recent?client_id=554c751130494dbbba66cb0a27602b07';
	findPhotos(address);
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

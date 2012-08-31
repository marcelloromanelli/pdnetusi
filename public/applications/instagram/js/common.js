var ids = new Array();
var enlarged = 0;
var last = new Array(); 

$(function(){
	
	$('#container').isotope({
		itemSelector : '.item',
		layoutMode : 'fitRows'
	});

	findPhotosWithTag("usilugano",false);

	setInterval(function(){findPhotosWithTag("usilugano", true);}, 10000);
	setInterval(function(){findPhotosNearCoordinates(46.010868,8.958235,true);}, 60000);
});


function insertNewPhoto(newItem){
	if($(".item").length > 25){
		var toremove = $(".item").splice(-5);
		for (var index in toremove){
			$(toremove[index]).remove();
		}
		last.splice(0,5);
	}
	
	$('#container').prepend(newItem);
	$("img").mousedown(function(){
		return false;
	});
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
			for (var i = 0; i < response.data.length; i++){
				if(inserted == 5 && limit){
					break;
				}
				var current = response.data[i];

				var img_thumb = current.images.thumbnail.url;
				var img_low = current.images.low_resolution.url;
				var img_std = current.images.standard_resolution.url;


				var newItem = $("<div class='item' />");
				newItem.click(function(){
					
					if(enlarged > 2){
						var last = $($(".item.large").get(-1));
						last.toggleClass('small');
						last.toggleClass('large');
						enlarged--;
						$("#container").isotope( 'reloadItems' ).isotope({sortBy: 'original-order',layoutMode : 'masonry'});
						return false;
					}
					
					$(this).toggleClass('small');
					$(this).toggleClass('large');
					$(this).find("img").attr("src",$(this).data("std"));
					
					if($(this).hasClass("large")){
						if($(".item:first")[0] === this){
							$($(".item").get(1)).after($(this));
						} else {
							$(".item:first").after($(this));
						}
						enlarged++;
					} else {
						enlarged--;
					}
					
					$("#container").isotope( 'reloadItems' ).isotope({sortBy: 'original-order',layoutMode : 'masonry'});
					
				});
				
				newItem.addClass("small");
				newItem.data("std",img_std);

				var img = $("<img />");
				img.attr("src",img_low);

				newItem.append(img);

				if(jQuery.inArray(current.id, ids) == -1){
					insertNewPhoto(newItem);
					ids.push(current.id);
					var stored = createObject(current.user.username, current.caption.text, current.link, img_thumb);
					last.push(stored);
					inserted++;
				} 

			}
			$("#container").isotope( 'reloadItems' ).isotope({sortBy: 'original-order',layoutMode : 'masonry'});

		}   

	});
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
	console.log("looking for photos near USI");
	var address = 'https://api.instagram.com/v1/media/search?lat=' + lat 
	+ '&lng=' + lng 
	+'&distance=100&client_id=554c751130494dbbba66cb0a27602b07' +
	'&count=100';
	findPhotos(address, limit);
}

function findPhotosWithTag(tag, limit){
	console.log("checking photos with tag: " + tag);
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

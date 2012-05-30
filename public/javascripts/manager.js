
	currentSelected = null;
	layoutidselected = null;
	objSelected = null;
	
	$("body").css("display", "none");
    $("body").fadeIn(2000);
	
	$("a.transition").click(function(event){
        event.preventDefault();
        linkLocation = this.href;
        $("body").fadeOut(5000, redirectPage);
    });
 
    function redirectPage() {
        window.location = linkLocation;
    }

	function highlight(obj){
		//console.log(obj);
	}

	function selectDisplay(displayid,caller){
		currentSelected = displayid;
		objSelected = caller;
		console.log(currentSelected);
	}

	function deleteDisplay(){
		var result = {};
		result.currentSelected = currentSelected;
		jQuery.ajax({
			url: getBaseURL() + 'manager/deletedisplay',
			type: 'POST',
			data: JSON.stringify(result),
			contentType: "application/json",
			error: function(xhr, ajaxOptions, thrownError){ 
				var msg = $('<div class="alert alert-block">'
				+ '<a class="close" data-dismiss="alert">X</a><h4 class="alert-heading">Warning!</h4>'
				+ xhr.responseText
				+ '</div>');
				$('#message').html(msg);
			},
			success: function(data){
				var linetoremove = $("#displayTable tr td:contains('" + data.removedid + "')").parent();
				$("#displayscard").toggleClass('hovered');
				linetoremove.effect("fade", {}, 3000, function(){
					linetoremove.remove();
                });
			}

		});
	}

	function deleteLayout(){
		var result = {};
		result.layoutidselected = layoutidselected;
		jQuery.ajax({
			url: getBaseURL() + 'manager/deletelayout',
			type: 'POST',
			data: JSON.stringify(result),
			contentType: "application/json",
			error: function(xhr, ajaxOptions, thrownError){ 
				var msg = $('<div class="alert alert-block">'
				+ '<a class="close" data-dismiss="alert">X</a><h4 class="alert-heading">Warning!</h4>'
				+ xhr.responseText
				+ '</div>');
				$('#message').html(msg);
			},
			success: function(data){
				var linetoremove = $("#layoutTable tr td:contains('" + data.removedid + "')").parent();
				$("#layoutcard").toggleClass('hovered');
				linetoremove.effect("fade", {}, 3000, function(){
					linetoremove.remove();
                });
			}

		});
	}

	function linkDisplayToLayout(layoutid){
		layoutidselected = layoutid;
		if (currentSelected == null){
			return;
		}
		var result = {};
		result.kind = "linking";
		result.layoutid = layoutid;
		result.currentSelected = currentSelected;

		jQuery.ajax({
			url: getBaseURL() + 'manager/updatedisplay',
			type: 'POST',
			data: JSON.stringify(result),
			contentType: "application/json",
			error: function(xhr, ajaxOptions, thrownError){ 
				var msg = $('<div class="alert alert-block">'
				+ '<a class="close" data-dismiss="alert">X</a><h4 class="alert-heading">Warning!</h4>'
				+ xhr.responseText
				+ '</div>');
				$('#message').html(msg);
			},
			success: function(data){
				var layoutid =  $(objSelected).find('td:last'); 
				layoutid.html(data.layoutid);
				layoutid.css('font-weight','bold');

				window.blinker = setInterval(function(){
					if(window.blink){
						layoutid.css('color','green');
						window.blink=false;
					}
					else{
						layoutid.css('color','whiteSmoke');
						window.blink = true;
					}
					},250);
					setTimeout(function()
					{
						if(window.blinker){ 
							clearInterval(window.blinker); 
							layoutid.css('color','#404040');
							layoutid.css('font-weight','normal');
						}
						} , 2500);


						var msg = $('<div class="alert alert-success">'
						+ '<a class="close" data-dismiss="alert">X</a><h4 class="alert-heading">Well done!</h4>'
						+ 'Your screen has been updated succesfully.'
						+ '</div>');
						$('#message').html(msg);
					}

				});
			}

			function modify(id, name, width, height, latitude, longitude){
				$("#displayscard").toggleClass('hovered');

				$("#displaymodify").show();			
				$("#displaynew").hide();

				$("#displayformname").val(name);
				$("#displayformwidth").val(width);
				$("#displayformheight").val(height);
				$("#displayformlatitude").val(latitude);
				$("#displayformlongitude").val(longitude);

			}

			function modifylayout(id, name){
				$("#layoutcard").toggleClass('hovered');

				$("#layoutmodify").show();			
				$("#layoutnew").hide();

				$("#layoutformname").val(name);

			}

			function opennewdisplay(){
				$("#displayscard").toggleClass('hovered');
				$("#displaymodify").hide();			
				$("#displaynew").show();
			}
			
			function opennewlayout(){
				$("#layoutcard").toggleClass('hovered');
				$("#layoutmodify").hide();			
				$("#layoutnew").show();
			}
						

			function addNewDisplay(){
				var result = {};
				result.name = $("#displayformnamen").val();
				console.log($("#displayformnamen").val());
				result.width = $("#displayformwidthn").val();
				result.height = $("#displayformheightn").val();
				result.latitude = $("#displayformlatituden").val();
				result.longitude = $("#displayformlongituden").val();

				jQuery.ajax({
					url: getBaseURL() + 'manager/newdisplay',
					type: 'POST',
					data: JSON.stringify(result),
					contentType: "application/json",
					error: function(xhr, ajaxOptions, thrownError){ 
						var msg = $('<div class="alert alert-block">'
						+ '<a class="close" data-dismiss="alert">X</a><h4 class="alert-heading">Warning!</h4>'
						+ xhr.responseText
						+ '</div>');
						$('#message').html(msg);
					},
					success: function(data){
						var row = $("<tr>");
						row.attr('onmouseover','highlight(this)');
						row.attr('onclick','selectDisplay(' + data.id + ',this)');
						row.attr('onDblClick','modify(' + data.id + ',' + '"' + data.name + '"' + ',' + data.width + ',' + data.height + ',' + data.latitude + ',' + data.longitude +  ')');
						row.append($("<td>").html(data.id));
						row.append($("<td>").html(data.name));
						row.append($("<td>").html(data.width + "x" + data.height));
						row.append($("<td>").html(data.latitude + "x" + data.longitude));
						row.append($("<td>").html("NONE"));
						$("#displayTable").append(row);
						$("#displayscard").toggleClass('hovered');
					}
				});
			}
			
			function addNewLayout(){
			  var result = {};
			  result.name = $("#layoutformnamen").val();
			  jQuery.ajax({
					url: getBaseURL() + 'manager/newlayout',
					type: 'POST',
					data: JSON.stringify(result),
					contentType: "application/json",
					error: function(xhr, ajaxOptions, thrownError){ 
						var msg = $('<div class="alert alert-block">'
						+ '<a class="close" data-dismiss="alert">X</a><h4 class="alert-heading">Warning!</h4>'
						+ xhr.responseText
						+ '</div>');
						$('#message').html(msg);
					},
					success: function(data){
						var row = $("<tr>");
						row.attr('onclick','linkDisplayToLayout(' + data.id + ')');
						row.attr('onDblClick','modifylayout(' + data.id + ',' + '"' + data.name + '"' +  ')');
						row.append($("<td>").html(data.id));
						row.append($("<td>").html($("<a>").attr("href", "layouts/"+data.id).html(data.name)));
						$("#layoutTable").append(row);
						$("#layoutcard").toggleClass('hovered');
					}
				});
			}
			
			function updateLayoutInformations(){
				var result = {};
				result.kind = "update";
				result.layoutidselected = layoutidselected;
				result.name = $("#layoutformname").val();
				jQuery.ajax({
					url: getBaseURL() + 'manager/updatelayout',
					type: 'POST',
					data: JSON.stringify(result),
					contentType: "application/json",
					error: function(xhr, ajaxOptions, thrownError){ 
						var msg = $('<div class="alert alert-block">'
						+ '<a class="close" data-dismiss="alert">X</a><h4 class="alert-heading">Warning!</h4>'
						+ xhr.responseText
						+ '</div>');
						$('#message').html(msg);
					},
					success: function(data){
						var linetoupdate = $("#layoutTable tr td:contains('" + data.id + "')").parent();
						linetoupdate.attr('onDblClick','modifylayout(' + data.id + ',"' + data.name + '")');
						$(linetoupdate.children()[1]).find("a").html(data.name);
						$("#layoutcard").toggleClass('hovered');
					}
				});
			}
			function updateDisplayInformations(){
				var result = {};
				result.kind = "update";
				result.displayid = currentSelected;
				result.name = $("#displayformname").val();
				result.width = $("#displayformwidth").val();
				result.height = $("#displayformheight").val();
				result.latitude = $("#displayformlatitude").val();
				result.longitude = $("#displayformlongitude").val();

				jQuery.ajax({
					url: getBaseURL() + 'manager/updatedisplay',
					type: 'POST',
					data: JSON.stringify(result),
					contentType: "application/json",
					error: function(xhr, ajaxOptions, thrownError){ 
						var msg = $('<div class="alert alert-block">'
						+ '<a class="close" data-dismiss="alert">X</a><h4 class="alert-heading">Warning!</h4>'
						+ xhr.responseText
						+ '</div>');
						$('#message').html(msg);
					},
					success: function(data){
						var linetoupdate = $("#displayTable tr td:contains('" + data.id + "')").parent();
						linetoupdate.attr('onDblClick','modify(' + data.id + ',' + '"' + data.name + '"' + ',' + data.width + ',' + data.height + ',' + data.latitude + ',' + data.longitude +  ')');
						
						$(linetoupdate.children()[1]).html(data.name);
						$(linetoupdate.children()[2]).html(data.width + " x " + data.height);
						$(linetoupdate.children()[3]).html(data.latitude + " , " + data.longitude);
						$(linetoupdate.children()[4]).html(data.layoutid);


						$("#displayscard").toggleClass('hovered');

					}
				});
			}
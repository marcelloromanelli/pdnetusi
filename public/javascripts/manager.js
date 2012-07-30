
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

	
			function modify(id, name, width, height, latitude, longitude){
				$("#displayscard").toggleClass('hovered');

				$("#displaymodify").show();			
				$("#displaynew").hide();

				$("#displayformname").val(name);
				$("#displayformlatitude").val(latitude);
				$("#displayformlongitude").val(longitude);

			}


			function opennewdisplay(){
				$("#displayscard").toggleClass('hovered');
				$("#displaymodify").hide();			
				$("#displaynew").show();
			}
			
						

			function addNewDisplay(){
				var result = {};
				result.name = $("#displayformnamen").val();
				console.log($("#displayformnamen").val());
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
			
			
			function updateDisplayInformations(){
				var result = {};
				result.kind = "update";
				result.displayid = currentSelected;
				result.name = $("#displayformname").val();
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
						$(linetoupdate.children()[3]).html(data.latitude + " , " + data.longitude);
						$(linetoupdate.children()[4]).html(data.layoutid);


						$("#displayscard").toggleClass('hovered');

					}
				});
			}
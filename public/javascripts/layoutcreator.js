var size = 60;

$(function() {
        $('#screen').css('width', size*16);
        $('#screen').css('height', size*9);
        
        var screenLeft = $('#screen').position().left;
        var screenTop = $('#screen').position().top;
		
        
		$("#screen").droppable({
        accept: '.tiles',
        
        drop: function(event, ui) {
                // Create a copy of the dragged object
                var draggedTile = $(ui.draggable).clone();
                
                // HACK TO CLONE ONLY WSADDR AND SETTINGS
                draggedTile.data("htmlSource",$(ui.draggable).data("htmlSource"));
                draggedTile.data("settings",$(ui.draggable).data("settings"));
                draggedTile.position(ui.position);
                
                var dtLeft = ui.position.left;
                var dtTop = ui.position.top;
                
                var correctLeft = Math.ceil(((dtLeft - screenLeft)/size))*size + 40;
                var correctTop = Math.ceil(((dtTop - screenTop)/size))*size + 80;                
                draggedTile.css({position: 'absolute', left: correctLeft, top: correctTop });
                
                
                var x = $(this).offset().left;
                var y = $(this).offset().top; 
                
                // Remove the class tile, otherwise 
                // it will call this function recursevely
                draggedTile.removeClass('tiles');

                // Insert the new tile in the layout
                // creator area
                $(this).append(draggedTile);
                
                // Make the new tile draggable
                draggedTile.draggable({
                        containment: 'parent',
                        grid: [size,size],
                        stop: function(event, ui) {
                          var position = $(this).position();

                          var startX = (position.left - screenLeft)/size;
                          var startY = (position.top - screenTop)/size;
                         
                          $(this).data('startX',startX);
                          $(this).data('startY',startY);
                          
                          $(this).html("<small>("+ startX + "," + startY + ")</small>");
                          $(this).append("<span id='deletebutton' onclick='deletetile(this);'> DELETE <span>");
                        }
                });
                var position = draggedTile.position();
          
                var startX = (position.left - screenLeft)/size;
                var startY = (position.top - screenTop)/size;
                
                draggedTile.data('startX',startX);
                draggedTile.data('startY',startY);
                draggedTile.html("<small>("+ startX + "," + startY + ")</small>");
                draggedTile.append("<span id='deletebutton' onclick='deletetile(this);'> DELETE <span>");
                
                draggedTile.dblclick(function(){
                	// Empty settings tab
                	$("#settings").html("");
                	
                	// Read setting values
                	var settingsVals = draggedTile.data("settings");

                	// Iterate trough settings and creates form
                	$.each(settingsVals, function(i, n){
                		$('<label for="'+n+'">'+i+"</label>").appendTo("#settings");
                		$('<input id="'+n+'">').appendTo("#settings");
                	});
                	
                	
                	$('<button class="btn" id="saveprefs">Save Preferences</button>').appendTo("#settings");
                	
                	// Save values back to dom object
                	$('#saveprefs').click(function(){
                		$.each(settingsVals, function(i, n){
                    		settingsVals[i] = $("#"+n).val();
                    	});
                		draggedTile.data("settings",settingsVals);
                	});

                	// OPEN THE FIRST TAB - SETTINGS
                	$('#accordion').accordion('activate', 0);

                });

        }
    });
});

function deletetile(elem){
	$(elem).parent().hide('explode', {}, 1000);
	$(elem).parent().remove();
}

	
		// This is a demo script to remove fake input placeholders (value="") from inputs on submit
		// Or you can do it sever side
		// francescomm
	
		$(document).on("submit",function(e) {
		
			
			// remove placeholders from all fields before submitting
			
			$("input,textarea").each(function() {
				var value=$(this).val();
				if($(this).val()!=="" && $(this).val()===$(this).attr("placeholder")) $(this).val("");
			});
			
			
			// in case submit fails, restore placeholders, after 1 second
			
			setTimeout(function() {
				$("input,textarea").each(function() {
					if($(this).val()==="" && $(this).attr("placeholder")!=="") $(this).val($(this).attr("placeholder"));
				});
			},1000);
			
			//e.preventDefault(); // don't stop, (uncomment for testing) let the submitting go on

		})

jQuery(function() {
	var requireElement = jQuery("<script data-main=\"main\" src=\"js/libs/require-2.1.9.js\"></script>");
	jQuery("head").append(requireElement);

	var loadOak = function() {
		Oak.create({
			containerElementId: "container",
			errorCallback: function(message, error) {
				alert(message);
				console.log(error);
			}
		});
	};	

	var checkOak = function() {
		if (!window.Oak) {
			console.log("Not found");
			setTimeout(function() {
				console.log("Looking again.");
				checkOak();
			}, 500);
		} else {
			console.log("Found!");
			loadOak();
		}
	};
	checkOak();
});

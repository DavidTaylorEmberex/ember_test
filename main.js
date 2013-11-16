require([
		"js/libs/handlebars-v1.1.2",
		"js/libs/ember-debug-1.1.2"], function() {
	require(["js/libs/ember-data-debug"], function() {
		require(["js/libs/localstorage_adapter"], function() {
			console.log("loaded 3");
		});
		console.log("loaded 2");
	});
	console.log("loaded");
	window.Oak = {};
	Oak.containerElement = jQuery("body");
	Oak.errorCallback = function(message, error) {};
	Oak.create = function(options) {
		console.log("Setting options...");
		// Set up options.
		if (options.containerElementId) {
			Oak.containerElement = jQuery("#" + options.containerElementId);
		}
		if (options.errorCallback) {
			Oak.errorCallback = options.errorCallback;
		}

		// Add template scripts.
		var appendTemplate = function(templateName, callback) {
			jQuery.get("templates/" + templateName, function(data) {
				Oak.containerElement.prepend(data);
				callback(templateName);
			});
		};

		var templates = ["item-template.tpl", "list-template.tpl"];
		var toLoad = templates.length;
		var loaded = 0;
		for (var i = 0; i < toLoad; i++) {
			appendTemplate(templates[i], function(template) {
				console.log("Loaded " + template);
				loaded++;
				if (loaded == toLoad) {
					require(["js/compiled"], function() {
						console.log("Everything is loaded!");
					});
				}
			});
		}

		console.log("Foo");
	};
	console.log("really loaded");
});

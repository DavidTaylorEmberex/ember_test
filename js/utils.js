Todos.Utils = {
	propagateModifications: function(todo, store) {
		// elements is a DS.RecordArray implements Ember.Enumerable
		var elements = store.all(Todos.Todo);
		var keepModifying = true;
		while (keepModifying) {
			keepModifying = false;
			var modifiers = [];
			for (var check in Todos.Todo.PropagationChecks) {
				if (Todos.Todo.PropagationChecks[check](todo)) {
					modifiers.push(check);
				}
			}
			elements.forEach(function(item, index, enumerable) {
				for (var check in Todos.Todo.PropagationChecks) {
					if (Todos.Todo.PropagationChecks[check](item) && !modifiers.contains(check)) {
						modifiers.push(check);
					}
				}
			});
			elements.forEach(function(item, index, enumerable) {
				for (var i = 0; i < modifiers.length; i++) {
					var methodName = modifiers[i];
					var method = Todos.Todo.PropagatingModifiers[methodName];
					keepModifying = method(item) || keepModifying;
				}
			});
		}
	}
};

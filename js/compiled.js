window.Todos = Ember.Application.create({
	rootElement: '#container'
});

Todos.ApplicationAdapter = DS.LSAdapter.extend({
	namespace: 'todo-emberjs'
});

Todos.Router.map(function() {
	this.resource('todos', { path: '/' }, function() {
		// additional child routes
		this.route('active');
		this.route('completed');
	});
});

Todos.TodosRoute = Ember.Route.extend({
	model: function() {
		return this.store.find('todo');
	}
});

Todos.TodosIndexRoute = Ember.Route.extend({
	model: function() {
		return this.modelFor('todos');
	}
});

Todos.TodosActiveRoute = Ember.Route.extend({
	model: function() {
		return this.store.filter('todo', function(todo) {
			return !todo.get('isCompleted');
		});
	},
	
	// Override behavior of changing the template by rerendering
	// the current template.
	renderTemplate: function(controller) {
		this.render('todos/index', { controller: controller });
	}
});

Todos.TodosCompletedRoute = Ember.Route.extend({
	model: function() {
		return this.store.filter('todo', function(todo) {
			return todo.get('isCompleted');
		});
	},
	
	// Override behavior of changing the template by rerendering
	// the current template.
	renderTemplate: function(controller) {
		this.render('todos/index', { controller: controller });
	}
});

Todos.Todo = DS.Model.extend({
	title: DS.attr('string'),
	isCompleted: DS.attr('boolean')
});

Todos.Todo.TitleValidators = {
	// Title is not blank.
	titleNotBlank: function(title) {
		if (title === undefined || title.trim() == "") {
			Oak.errorCallback("Title may not be blank.", new Error("Title may not be blank."));
			return false;
		}
		return true;
	},

	// Title does not contain p.
	titleDoesNotContainP: function(title) {
		if (title.match(/.*[pP].*/)) {
			Oak.errorCallback("Title may not contain p.", new Error("Title may not contain p."));
			return false;
		}
		return true;
	}
};

Todos.Todo.PropagationChecks = {
	replaceY: function(todo) {
		return todo.get('title').match(/.*[xX].*/);
	},

	replaceNumbers: function(todo) {
		return todo.get('title').match(/.*[zZ].*/);
	}
};

Todos.Todo.PropagatingModifiers = {
	// Replace y's with z's.
	replaceY: function(todo) {
		var oldTitle = todo.get('title');
		var newTitle = oldTitle.replace(/y/g, 'z').replace(/Y/g, 'Z');
		if (newTitle != oldTitle) {
			todo.set('title', newTitle);
			todo.save();
		}
		return newTitle != oldTitle;
	},

	// Replace 2's and 5's with a's.
	replaceNumbers: function(todo) {
		var oldTitle = todo.get('title');
		var newTitle = oldTitle.replace(/[25]/g, 'a');
		if (newTitle != oldTitle) {
			todo.set('title', newTitle);
			todo.save();
		}
		return newTitle != oldTitle;
	}
};

Todos.TodosController = Ember.ArrayController.extend({
	actions: {
		createTodo: function() {
			// Get the todo title set by the "New Todo" text field.
			var title = this.get('newTitle');
			for (var validator in Todos.Todo.TitleValidators) {
				if (!Todos.Todo.TitleValidators[validator](title)) {
					return;
				}
			}

			// Create the new Todo model.
			var todo = this.store.createRecord('todo', {
				title: title,
				isCompleted: false
			});

			// Save the new model.
			todo.save();

			// Clear the "New Todo" text field.
			this.set('newTitle', '');

			Todos.Utils.propagateModifications(todo, this.store);
		},

		clearCompleted: function() {
			var completed = this.filterBy('isCompleted', true);
			completed.invoke('deleteRecord');
			completed.invoke('save');
		}
	},

	remaining: function() {
		return this.filterBy('isCompleted', false).get('length');
	}.property('@each.isCompleted'),

	inflection: function() {
		var remaining = this.get('remaining');
		return remaining === 1 ? 'item' : 'items';
	}.property('remaining'),

	hasCompleted: function() {
		return this.get('completedCount') > 0;
	}.property('completedCount'),

	completedCount: function() {
		return this.filterBy('isCompleted', true).get('length');
	}.property('@each.isCompleted'),

	allAreDone: function(key, value) {
		if (value === undefined) {
			return !!this.get('length') && this.everyBy('isCompleted', true);
		} else {
			this.setEach('isCompleted', value);
			this.invoke('save');
			return value;
		}
	}.property('@each.isCompleted')
});

Todos.TodoController = Ember.ObjectController.extend({
	isCompleted: function(key, value) {
		var model = this.get('model');
		if (value === undefined) {
			// property being used as a getter
			return model.get('isCompleted');
		} else {
			// property being used as a setter
			model.set('isCompleted', value);
			model.save();
			return value;
		}
	}.property('model.isCompleted'),

	actions: {
		editTodo: function() {
			this.set('isEditing', true);
		},

		acceptChanges: function() {
			var title = this.get('model.title');
			if (Ember.isEmpty(title)) {
				this.send('removeTodo');
			} else if (title.match(/.*[pP].*/)) {
				return;
			} else {
				var model = this.get('model');
				var foo = this.store.filter('todo', function(todo) {
					return true;
				});
				model.save();
				Todos.Utils.propagateModifications(model, this.store);
			}
			this.set('isEditing', false);
		},

		removeTodo: function() {
			var todo = this.get('model');
			todo.deleteRecord();
			todo.save();
		}
	},

	isEditing: false
});

Todos.EditTodoView = Ember.TextField.extend({
	didInsertElement: function() {
		this.$().focus();
	}
});

Ember.Handlebars.helper('edit-todo', Todos.EditTodoView);

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


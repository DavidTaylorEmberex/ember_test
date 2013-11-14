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

			Todos.Utils.propagateModifications(todo, this);
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

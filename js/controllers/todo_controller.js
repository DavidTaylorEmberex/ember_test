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

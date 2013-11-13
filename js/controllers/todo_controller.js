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
			this.set('isEditing', false);
			var title = this.get('model.title');
			if (Ember.isEmpty(title) || title.match(/.*[pP].*/)) {
				this.send('removeTodo');
			} else {
				if (title.match(/.*[xX].*/)) {
					var newTitle = title.replace(/x/, 'y').replace(/X/, 'Y');
					this.set('model.title', newTitle);
					this.invoke('save');
				}
				this.get('model').save();
			}
		},

		removeTodo: function() {
			var todo = this.get('model');
			todo.deleteRecord();
			todo.save();
		}
	},

	isEditing: false
});

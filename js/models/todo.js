Todos.Todo = DS.Model.extend({
	title: DS.attr('string'),
	isCompleted: DS.attr('boolean')
});

Todos.Todo.FIXTURES = [
	{
		id: 1,
		title: 'Learn Ember',
		isCompleted: true
	},
	{
		id: 2,
		title: '...',
		isCompleted: false
	},
	{
		id: 3,
		title: 'Profit',
		isCompleted: false
	}
];

Todos.Todo.TitleValidators = {
	// Title is not blank.
	titleNotBlank: function(title) {
		return title !== undefined && title.trim() != "";
	},

	// Title does not contain p.
	titleDoesNotContainP: function(title) {
		return !title.match(/.*[pP].*/);
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

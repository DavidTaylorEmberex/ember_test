window.Todos = Ember.Application.create({
	rootElement: '#container'
});

//Todos.ApplicationAdapter = DS.FixtureAdapter.extend({
Todos.ApplicationAdapter = DS.LSAdapter.extend({
	namespace: 'todo-emberjs'
});

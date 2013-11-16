<script type="text/x-handlebars" data-template-name="todos">
	<section id="todoapp">
		<header id="header">
			<h1>todos</h1> 
			<!-- Note that "newTitle" is not quoted, since it is a variable. -->
			{{input type="text" id="new-todo" placeholder="What needs to be done?"
						value=newTitle action="createTodo"}}
		</header>
	
		<section id="main">
			{{outlet}}
			{{input type="checkbox" id="toggle-all" checked=allAreDone}}
		</section>
	
		<footer id="footer">
			<span id="todo-count">
					<strong>{{remaining}}</strong> {{inflection}} left
			</span>
			<ul id="filters">
				<li>
					{{#link-to "todos.index" activeClass="selected"}}All{{/link-to}}
				</li>
				<li>
					{{#link-to "todos.active" activeClass="selected"}}Active{{/link-to}}
				</li>
				<li>
					{{#link-to "todos.completed" activeClass="selected"}}Completed{{/link-to}}
				</li>
			</ul>
	
			{{#if hasCompleted}}
				<button id="clear-completed" {{action "clearCompleted"}}>
					Clear completed ({{completedCount}})
				</button>
			{{/if}}
		</footer>
	</section>
</script>

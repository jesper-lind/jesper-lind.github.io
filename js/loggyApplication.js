angular.module('loggyApp', [])
    .controller('loggyController', function() {

        var loggy = this;

        loggy.trade = {
            "id": "1234",
            "productId": "312312313",
            "instrument": {
                "id": "abc",
                "price": "99,1"
            },
            "currency": "GBP"
        };

        loggy.instruments = [
            {"id":"abc","price":"99,1"},
            {"id":"aaa","price":"100"},
            {"id":"bbb","price":"98"}];

        loggy.alerts =[];

/*


        var todoList = this;
        todoList.todos = [
            {text:'learn AngularJS', done:true},
            {text:'build an AngularJS app', done:false}];

        todoList.addTodo = function() {
            todoList.todos.push({text:todoList.todoText, done:false});
            todoList.todoText = '';
        };

        todoList.remaining = function() {
            var count = 0;
            angular.forEach(todoList.todos, function(todo) {
                count += todo.done ? 0 : 1;
            });
            return count;
        };

        todoList.archive = function() {
            var oldTodos = todoList.todos;
            todoList.todos = [];
            angular.forEach(oldTodos, function(todo) {
                if (!todo.done) todoList.todos.push(todo);
            });
        };*/
    });
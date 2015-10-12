var TodoColl    = new Mongo.Collection('Todos'),
    alwaysTrue  = function () {return true};

TodoColl.allow({
  insert: alwaysTrue,
  update: alwaysTrue,
  remove: alwaysTrue
});

if (Meteor.isClient) {
    Meteor.subscribe('todos');

    Template.addTodo.events({
      "click #add-todo": function (ev) {
        ev.preventDefault();

        TodoColl.insert({
          createdAt: new Date(),
          text: $("#todo-text").val(),
          done: false
        }, function () {
          $("#todo-text").val("");
        });
      }
    });

    Template.todoList.helpers({
      "todosList": function () { return TodoColl.find(); },
      "checkedState": function () {
        return TodoColl.findOne({_id: this._id}).done ? "checked" : "";
      }
    });

    Template.todoList.events({
      "change .todo-item-check": function (ev) {
        var status = $(ev.target).is(':checked');
        TodoColl.update({_id: this._id}, {$set: {done: status}});
        $(ev.target).parent().css('text-decoration', status ? 'line-through' : 'none');
      },
      "click #delete-done": function (ev) {
        TodoColl.find({"done": true}).forEach(function (todo) {
            TodoColl.remove({_id: todo._id});
          });
        }
    });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Meteor.publish('todos', function () { return TodoColl.find({}) })
  });
}

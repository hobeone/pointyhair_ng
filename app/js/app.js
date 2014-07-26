'use strict';


// Declare app level module which depends on filters, and services
var myapp = angular.module('myApp', [
  'ui.router',
  'restangular',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
]).run(['$rootScope', '$state', '$stateParams', function ($rootScope,   $state,   $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
}]);

myapp.config(function($stateProvider, $urlRouterProvider, RestangularProvider) {
  $urlRouterProvider.when('/p?id','/people/:id').otherwise('/');

  RestangularProvider.setBaseUrl('http://localhost:3000/api/1');
  RestangularProvider.addElementTransformer('people', false, function(element) {
   if (typeof element.todos !== 'undefined') {
     for (var i=0; i < element.todos.length; i++){
       element.todos[i].date = new Date( element.todos[i].date);
     }
   }
   if (typeof element.notes !== 'undefined') {
     for (var i=0; i < element.notes.length; i++){
       element.notes[i].date = new Date( element.notes[i].date);
     }
   }
   return element;
  });

  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: 'partials/home.html'
  })
  .state('people', {
    url: '/people',
    abstract: true,
    templateUrl: 'partials/people.html',
    controller: 'PeopleController as peopleCtrl',
  })
  .state('people.list', {
    url: '',
    templateUrl: 'partials/people.list.html'
  })
  .state('people.detail', {
    url: '/{personId:[0-9]{1,4}}',
    templateUrl: 'partials/person-detail.html',
    controller: 'PersonController as personCtrl',
  });
});

myapp.controller('PeopleController', ['Restangular', function(Restangular) {
  var basePeople = Restangular.all('people');
  var self = this;
  this.people = [];

  this.reloadPeople = function() {
    basePeople.getList().then(function(people) {
      self.people = people;
    });
  };
  this.reloadPeople();

  this.addPerson = function(person) {
    console.log('Adding person');
    console.log(person);
    basePeople.post(person).then(function(resp) {
      console.log('Person saved');
      self.people.push(resp);
      person = {};
    }, function(resp) {
      console.log('There was an error saving the person: '+resp);
    });
  };
}]);
myapp.controller('PersonController', ['$stateParams', 'Restangular', function($stateParams, Restangular) {
  var basePeople = Restangular.one('people', $stateParams.personId);
  this.person = {};
  var self = this;
  basePeople.get().then(function(person) {
    self.person = person;
  });
}]);

myapp.controller('TodoController', ['Restangular', '$window', function(Restangular, $window) {
  var self = this;
  this.todo = {
    date: new Date()
  };
  this.submiterror = '';
  this.showForm = false;
  this.flipShowForm = function() {
    self.showForm = !self.showForm;
  };

  this.addTodoToAll = function(todo, peoplectrl) {
    console.log('Adding todo to all persons');
    try {
      self.todo.date = new Date(self.todo.date).toISOString();
    }
    catch(err) {
      self.submiterror = 'Invalid date format: '+err;
      return;
    }
    var baseTodos = Restangular.all('todos');
    baseTodos.post(self.todo, {addToAll: true}).then(function() {
      console.log('Saved todo');
      self.todo = {};
      self.submiterror = '';
      self.flipShowForm();
      peoplectrl.reloadPeople();
    }, function(data) {
      self.submiterror = 'There was an error saving'+data;
      console.log('There was an error saving'+data);
    });
  };

  this.addTodo = function(person) {
    self.todo.person = person.id;
    console.log(self.todo);
    try {
      self.todo.date = new Date(self.todo.date).toISOString();
    }
    catch(err) {
      self.submiterror = 'Invalid date format: '+err;
      return;
    }
    var baseTodos = Restangular.all('todos');
    baseTodos.post(self.todo).then(function(resp) {
      console.log('Object saved OK');
      person.todos.push(resp);
      self.todo = {};
      self.submiterror = '';
      self.flipShowForm();
    }, function(data) {
      self.submiterror = 'There was an error saving'+data;
      console.log('There was an error saving'+data);
    });
  };

  this.deleteTodo = function(person, todo) {
    var deleteUser = $window.confirm('Are you absolutely sure you want to delete?');   
    console.log(todo);
    console.log(person);
    if (deleteUser) {
      Restangular.one('todos', todo.id).remove().then(function() {
        console.log('Removed todo: ' + todo.id);
        var i = person.todos.indexOf(todo);
        person.todos.splice(i, 1);
      }, function(resp) {
        console.log('Error removing todo: ' + todo.id + ': ' + resp);
      });
    }
  };


}]);

myapp.controller('NoteController', ['Restangular', '$window', function(Restangular, $window) {
  var self = this;
  this.note = {
    date: new Date()
  };
  this.showForm = false;
  this.flipShowForm = function() {
    self.showForm = !self.showForm;
  };
  this.addNote = function(person) {
    self.note.person = person.id;
    console.log(self.note);
    self.note.date = new Date(self.note.date).toISOString();
    var baseNotes = Restangular.all('notes');
    baseNotes.post(self.note).then(function(resp) {
      console.log('Object saved OK');
      person.notes.push(resp);
      self.note = {};
      self.flipShowForm();
    }, function(resp) {
      console.log('There was an error saving:');
      console.log(resp);
    });
  };
  this.deleteNote = function(person, note) {
    var deleteUser = $window.confirm('Are you absolutely sure you want to delete?');   
    console.log(note);
    console.log(person);
    if (deleteUser) {
      Restangular.one('notes', note.id).remove().then(function() {
        console.log('Removed note: ' + note.id);
        var i = person.notes.indexOf(note);
        person.notes.splice(i, 1);
      }, function(resp) {
        console.log('Error removing note: ' + note.id + ': ' + resp);
      });
    }
  };
}]);
myapp.directive('noteView', function() {
  return {
    restrict: 'E',
    templateUrl: 'partials/notes.html',
  };
});

myapp.directive('todoView', function() {
  return {
    restrict: 'E',
    templateUrl: 'partials/todo.html',
  };
});

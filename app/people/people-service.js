angular.module('pointyHair.people.service', [

])

// A RESTful factory for retreiving contacts from 'contacts.json'
.factory('people', ['$http', function ($http, utils) {
  var path = 'app/assets/people.json';
  var people = $http.get(path).then(function (resp) {
    return resp.data.people;
  });

  var factory = {};
  factory.all = function () {
    return people;
  };
  factory.get = function (id) {
    return people.then(function(){
      return utils.findById(people, id);
    });
  };
  return factory;
}]);

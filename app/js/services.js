'use strict';

var myappServices = angular.module('myApp.services', ['restangular']);

/* Services */

/*
myappServices.factory('People', ['$resource', function($resource) {
  return $resource(APIURL+'api/1/people/:personId', {}, {
    query: {method: 'GET', params:{personId:''}, isArray:true}
  });
}]);
myappServices.factory('Tasks', ['$resource', function($resource) {
  return $resource(APIURL+'api/1/tasks/:personId', {}, {
    query: {method: 'GET', params:{personId:''}, isArray:true}
  });
}]);
*/
myappServices.value('version', '0.1');

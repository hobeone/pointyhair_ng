'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function(){

  describe('PeopleListController', function() {
    var scope, ctrl, $httpBackend;

    beforeEach(module('myApp'));
    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('people.json').
          respond([{name: 'Nexus S'}, {name: 'Motorola DROID'}]);

      scope = $rootScope.$new();
      ctrl = $controller('PeopleListController', {$scope: scope});
    }));

    it('should create "people" model with 2 people', function() {
      expect(scope.people).toBeUndefined();
      $httpBackend.flush();

      //var ctrl = $controller('PeopleListController', { $scope:scope});
      window.console.log(scope);
      expect(scope.people).toBeDefined();
      expect(scope.people.length).toBe(2);
    });
  });

});

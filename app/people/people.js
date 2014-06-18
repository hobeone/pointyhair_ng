angular.module('pointyHair.people', [
  'ui.router'
])

.config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('people', {
    url: '/people',
    templateUrl: 'app/people/people.html',
    resolve: {
      people: ['people',
        function(people){
          return people.all();
        }]
    },
    controller: ['$scope', '$state', 'people', 'utils',
      function($scope, $state, people, utils) {
        $scope.people = people;
      }]
  })
  .state('people.detail', {
    url: '/{personId:[0-9]{1,4}}',
    views: {
      'detail': {
        templateUrl: 'app/people/people.detail.html',
        controller: ['$scope', '$stateParams', 'utils',
          function($scope, $stateParams, utils) {
            $scope.person = utils.findById($scope.people, $stateParams.personId);
          }]
      },
      'hint@': {
        template: "HINT"
      }
    },
  });
}]);

angular
  .module('votes', [])
  .controller('VoteController',
    ['$scope', '$http', function ($scope, $http) {

    $scope.upvote = function () {
      $scope.hasVoted = true;
      $scope.votes++;
      $http.post('/votes/' + $scope.id, {vote: true});
    };
  }]);

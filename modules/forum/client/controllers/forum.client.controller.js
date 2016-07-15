(function() {
  'use strict';

  angular
    .module('forum')
    .controller('ForumController', ForumController);

  ForumController.$inject = ['$scope', 'Posts', '$location'];

  function ForumController($scope, Posts, $location) {
    var vm = this;

    // Forum controller logic
    $scope.find = function(){
      $scope.posts = Posts.query();
    };

    $scope.create = function(isValid){
      $scope.error = null;

      if(!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'postForm');
        return false;
      }

      var post = new Posts({
        title:$scope.title,
        text: $scope.text
      });

      post.$save(function(response) {

        $scope.title = '';
        $scope.text = '';
        $location.path('/forum');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.delete = function(post) {
      if(post) {
        post.$remove();

        for(var i in $scope.posts) {
          if($scope.posts[i] === post) {
            $scope.posts.splice(i, 1);
          }
        }
      }
    };

    init();

    function init() {
    }
  }
})();

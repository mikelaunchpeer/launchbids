(function() {
  'use strict';

  angular
    .module('forum')
    .controller('ForumController', ForumController);

  ForumController.$inject = ['$scope', 'Posts', '$location', 'Authentication'];

  function ForumController($scope, Posts, $location, Authentication) {
    var vm = this;
    $scope.user = Authentication.user;
    
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
        title: $scope.title,
        text: $scope.text,
        created_at: new Date()
      });

      // console.log(post);
      post.$save(function(response) {
        // console.log("RES:" + response);
        // console.log('SAVING..');
        $scope.title = '';
        $scope.text = '';
        // console.log('CLEARING FIELDS..');
        $location.path('/forum');
        // console.log('ROUTING TO FORUM..');
      }, function (errorResponse) {
        // console.log("err: " + errorResponse);
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

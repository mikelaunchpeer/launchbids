(function() {
  'use strict';

  angular
    .module('projects')
    .controller('ProjectsController', ProjectsController);

  ProjectsController.$inject = ['$scope', 'Listings', '$location', 'Authentication'];

  function ProjectsController($scope, Listings, $location, Authentication) {
    var vm = this;
    $scope.user = Authentication.user;

    // Projects controller logic
    $scope.find = function(){
      $scope.listings = Listings.query();
    };

    $scope.create = function(isValid){
      $scope.error = null;

      if(!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'listingForm');
        return false;
      }

      var listing = new Listings({
        title: $scope.title,
        text: $scope.text,
        created_at: new Date()
      });

      // console.log(listing);
      listing.$save(function(response) {
        // console.log("RES:" + response);
        // console.log('SAVING..');
        $scope.title = '';
        $scope.text = '';
        // console.log('CLEARING FIELDS..');
        $location.path('/projects');
        // console.log('ROUTING TO PROJECTS..');
      }, function (errorResponse) {
        // console.log("err: " + errorResponse);
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.delete = function(listing) {
      if(listing) {
        listing.$remove();

        for(var i in $scope.listings) {
          if($scope.listings[i] === listing) {
            $scope.listings.splice(i, 1);
          }
        }
      }
    };

    init();

    function init() {
    }
  }
})();

'use strict';

(function () {
  // Forum Controller Spec
  describe('Forum Controller Tests', function () {
    // Initialize global variables
    var ForumController,
      $scope,
      $httpBackend,
      $stateParams,
      $location,
      Posts,
      fakePost;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Posts_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      Posts = _Posts_;

      fakePost = new Posts({
        _id: '012345abcdef',
        title: 'Sample Post',
        text: 'Hello World'
      });

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;

      // Initialize the Forum controller.
      ForumController = $controller('ForumController', {
        $scope: $scope
      });
    }));

    describe('$scope.find()', function(){
      var samplePosts;
      beforeEach(function(){
        samplePosts = [fakePost];
      });

      it('should return an array of at least one post', inject(function(){
        $httpBackend.expectGET('/api/posts').respond(samplePosts);

        $scope.find();
        $httpBackend.flush();

        expect($scope.posts).toEqualData(samplePosts);
      }));
    });

    describe('$scope.create()', function(){
      var samplePostData;
      beforeEach(function(){
        samplePostData = {
          title: fakePost.title,
          text: fakePost.text
        };

        $scope.title = fakePost.title;
        $scope.text = fakePost.text;

        spyOn($location, 'path');
      });

      it('should sent a POST request, empty the form fields, and redirect to the /forum', inject(function(){
        $httpBackend.expectPOST('/api/posts', samplePostData).respond(fakePost);

        $scope.create(true);

        $httpBackend.flush();

        expect($scope.title).toBe('');
        expect($scope.text).toBe('');

        expect($location.path.calls.mostRecent().args[0]).toBe('/forum');
      }));
    });

    describe('$scope.delete()', function(){
      it('should send DELETE request and the posts array should be empty', inject(function(){
        $scope.posts = [fakePost];
        $httpBackend.expectDELETE(/api\/posts\/([0-9a-f]{12})$/).respond(204);

        $scope.delete(fakePost);
        $httpBackend.flush();

        expect($scope.posts.length).toBe(0);
      }));
    });
  });
}());

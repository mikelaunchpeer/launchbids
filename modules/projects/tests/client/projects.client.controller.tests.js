'use strict';

(function () {
  // Projects Controller Spec
  describe('Projects Controller Tests', function () {
    // Initialize global variables
    var ProjectsController,
      $scope,
      $httpBackend,
      $stateParams,
      $location,
      Listings,
      fakeListing;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Listings_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      Listings = _Listings_;

      fakeListing = new Listings({
        _id: '012345abcdef',
        title: 'Sample Listing',
        text: 'Hello World'
      });

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;

      // Initialize the Projects controller.
      ProjectsController = $controller('ProjectsController', {
        $scope: $scope
      });
    }));

    describe('$scope.find()', function(){
      var sampleListings;
      beforeEach(function(){
        sampleListings = [fakeListing];
      });

      it('should return an array of at least one listing', inject(function(){
        $httpBackend.expectGET('/api/listings').respond(sampleListings);

        $scope.find();
        $httpBackend.flush();

        expect($scope.listings).toEqualData(sampleListings);
      }));
    });

    describe('$scope.create()', function(){
      var sampleListingData;
      beforeEach(function(){
        sampleListingData = {
          title: fakeListing.title,
          text: fakeListing.text
        };

        $scope.title = fakeListing.title;
        $scope.text = fakeListing.text;

        spyOn($location, 'path');
      });

      it('should sent a POST request, empty the form fields, and redirect to /projects', inject(function(){
        $httpBackend.expectPOST('/api/listings', sampleListingData).respond(fakeListing);

        $scope.create(true);

        $httpBackend.flush();

        expect($scope.title).toBe('');
        expect($scope.text).toBe('');

        expect($location.path.calls.mostRecent().args[0]).toBe('/projects');
      }));
    });

    describe('$scope.delete()', function(){
      it('should send DELETE request and the listings array should be empty', inject(function(){
        $scope.listings = [fakeListing];
        $httpBackend.expectDELETE(/api\/listings\/([0-9a-f]{12})$/).respond(204);

        $scope.delete(fakeListing);
        $httpBackend.flush();

        expect($scope.listings.length).toBe(0);
      }));
    });
  });
}());

(function () {
  'use strict';

  angular
    .module('projects')
    .factory('Listings', Listings);

  Listings.$inject = ['$resource'];

  function Listings($resource) {
    // Listings service logic
    // ...

    // Public API
    return $resource('/api/listings/:listingId', {
      listingId: '@_id'
    }, {
      update: 'PUT'
    });
  }
})();

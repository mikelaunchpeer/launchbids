(function () {
  'use strict';

  angular
    .module('forum')
    .factory('Posts', Posts);

  Posts.$inject = ['$resource'];

  function Posts($resource) {
    // Posts service logic
    // ...

    // Public API
    return $resource('/api/posts/:postId', {
      postId: '@_id'
    }, {
      update: 'PUT'
    });
  }
})();

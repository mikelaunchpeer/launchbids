(function () {
  'use strict';

  //Setting up route
  angular
    .module('forum')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Forum state routing
    $stateProvider
      .state('forum', {
        abstract: true,
        url: '/forum',
        templateUrl: '<ui-view/>',
        data: {
          roles: ['user', 'admin']
        },
      })
      .state('forum.create', {
        url: '/create',
        templateUrl: 'modules/forum/client/views/forum-create.client.view.html',
        controller: 'ForumController',
        controllerAs: 'vm'
      })
      .state('forum.list', {
        url: '',
        templateUrl: 'modules/forum/client/views/forum-list-view.client.view.html',
        data: {
          roles: ['user', 'admin']
        },
        controller: 'ForumController',
        controllerAs: 'vm'
      });
  }
})();

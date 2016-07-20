(function () {
  'use strict';

  //Setting up route
  angular
    .module('projects')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Projects state routing
    $stateProvider
      .state('projects', {
        abstract: true,
        url: '/projects',
        templateUrl: '<ui-view/>',
        data: {
          roles: ['user', 'admin']
        },
      })
      .state('projects.create', {
        url: '/create',
        templateUrl: 'modules/projects/client/views/projects-create.client.view.html',
        controller: 'ProjectsController',
        controllerAs: 'vm'
      })
      .state('projects.list', {
        url: '',
        templateUrl: 'modules/projects/client/views/projects-list-view.client.view.html',
        data: {
          roles: ['user', 'admin']
        },
        controller: 'ProjectsController',
        controllerAs: 'vm'
      });
  }
})();

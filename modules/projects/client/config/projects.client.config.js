(function() {
  'use strict';

  // Projects module config
  angular
    .module('projects')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Config logic
    Menus.addMenuItem('topbar',{
      title: 'Projects',
      state: 'projects',
      type: 'dropdown',
      roles: ['user', 'admin']
    });

    Menus.addSubMenuItem('topbar', 'projects', {
      title: 'Project Listings',
      state: 'projects.list'
    });

    Menus.addSubMenuItem('topbar', 'projects', {
      title: 'New Project',
      state: 'projects.create'
    });
  }
})();

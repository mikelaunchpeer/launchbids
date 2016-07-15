(function() {
  'use strict';

  // Forum module config
  angular
    .module('forum')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Config logic
    Menus.addMenuItem('topbar',{
      title: 'Projects',
      state: 'forum',
      type: 'dropdown',
      roles: ['user', 'admin']
    });

    Menus.addSubMenuItem('topbar', 'forum', {
      title: 'Project Listings',
      state: 'forum.list'
    });

    Menus.addSubMenuItem('topbar', 'forum', {
      title: 'New Project',
      state: 'forum.create'
    });
  }
})();

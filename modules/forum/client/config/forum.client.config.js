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
      title: 'Forum',
      state: 'forum',
      type: 'dropdown',
      roles: ['user', 'admin']
    });

    Menus.addSubMenuItem('topbar', 'forum', {
      title: 'List Posts',
      state: 'forum.list'
    });

    Menus.addSubMenuItem('topbar', 'forum', {
      title: 'New Post',
      state: 'forum.create'
    });
  }
})();

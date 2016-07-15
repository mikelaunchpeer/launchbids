'use strict';

var posts = require('../controllers/forum.server.controller.js');

module.exports = function(app) {
  // Routing logic
  app.route('/api/posts')
    .get(posts.list)
    .post(posts.create);

  app.route('/api/posts/:postId')
    .delete(posts.delete);

  app.param('postId', posts.postByID);
};

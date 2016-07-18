'use strict';

var posts = require('../controllers/forum.server.controller.js');
var postsAccessPolicy = require('../policies/post.server.policy');

module.exports = function(app) {
  // Routing logic
  app.route('/api/posts').all(postsAccessPolicy.isAllowed)
    .get(posts.list)
    .post(posts.create);

  app.route('/api/posts/:postId').all(postsAccessPolicy.isAllowed)
    .delete(posts.delete);

  app.param('postId', posts.postByID);
};

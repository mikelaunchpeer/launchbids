'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Post = mongoose.model('Post'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Post
 */
exports.create = function (req, res) {
  var post = new Post(req.body);
  post.author = req.user;

  post.save(function(err){
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(post);
    }
  });
};

/**
 * Show the current Forum
 */
exports.read = function (req, res) {

};

/**
 * Update a Forum
 */
exports.update = function (req, res) {

};

/**
 * Delete a Post
 */
exports.delete = function (req, res) {
  var post = req.post;

  post.remove(function (err){
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(post);
    }
  });
};

/**
 * List of Posts
 */
exports.list = function (req, res) {
  Post.find().populate('author', 'displayName').exec(function (err, posts){
    if(err){
      return res.staturs(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(posts);
    }
  });
};

/**
  * Post Middleware
 */
exports.postByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Post ID is invalid'
    });
  }

  Post.findById(id).populate('author', 'displayName').exec(function(err, post) {
    if (err) {
      return next(err);
    } else if (!post) {
      return res.status(404).send({
        message: 'No post with that indentifier has been found'
      });
    }
    req.post = post;
    next();
  });
};

'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Listing = mongoose.model('Listing'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Project Listing
 */
exports.create = function (req, res) {
  var listing = new Listing(req.body);
  listing.author = req.user;

  listing.save(function(err) {
    if(err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(listing);
    }
  });
};

/**
 * Show the current Project Listing
 */
exports.read = function (req, res) {

};

/**
 * Update a Project Listing
 */
exports.update = function (req, res) {

};

/**
 * Delete a Project Listing
 */
exports.delete = function (req, res) {
  var listing = req.listing;

  listing.remove(function (err){
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(listing);
    }
  });
};

/**
 * List of Project Listings
 */
exports.list = function (req, res) {
  Listing.find().populate('author', 'displayName').exec(function (err, listings){
    if(err){
      return res.staturs(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(listings);
    }
  });
};

/**
  * Project Listing Middleware
 */
exports.listingByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Listing ID is invalid'
    });
  }

  Listing.findById(id).populate('author', 'displayName').exec(function(err, listing) {
    if (err) {
      return next(err);
    } else if (!listing) {
      return res.status(404).send({
        message: 'No listing with that indentifier has been found'
      });
    }
    req.listing = listing;
    next();
  });
};

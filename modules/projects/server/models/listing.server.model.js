'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Project Listing Schema
 */
var ListingSchema = new Schema({
  // Project Listing model fields
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'The title cannot be blank'
  },
  text: {
    type: String,
    default: '',
    trim: true,
  },
  author: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  created_at: {
    type: String,
    default: '',
    trim: true,
    required: 'The date cannot be blank'
  },
});

mongoose.model('Listing', ListingSchema);

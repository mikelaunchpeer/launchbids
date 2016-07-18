'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Post Schema
 */
var PostSchema = new Schema({
  // Post model fields
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

mongoose.model('Post', PostSchema);

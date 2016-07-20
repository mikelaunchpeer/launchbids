'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Listing = mongoose.model('Listing');

/**
 * Globals
 */
var user, listing;

/**
 * Unit tests
 */
describe('Listing Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() {
      listing = new Listing({
        // Add model fields
        title: 'Sample Listing',
        text: 'Hello World',
        created_at: new Date()
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      return listing.save(function(err) {
        should.not.exist(err);
        done();
      });
    });
    it('should not be able to save if the title is empty', function(done) {
      listing.title = '';
      return listing.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Listing.remove().exec();
    User.remove().exec();

    done();
  });
});

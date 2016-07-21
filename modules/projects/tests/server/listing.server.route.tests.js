'use strict';

var should = require('should');
var request = require('supertest');
var path = require('path');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Listing = mongoose.model('Listing');
var express = require(path.resolve('./config/lib/express'));

// global variables
var app, agent, credentials, user, listing, user2, credentials2;

// listings route Tests
describe('Listing CRUD tests', function(){
  before(function(done){
    app = express.init(mongoose);
    agent = request.agent(app);
    done();
  });

  beforeEach(function(done){
    credentials = {
      username: 'MEANJSUser',
      password: 's@mp1ePassword'
    };

    credentials2 = {
      username: 'MEANJSUser2',
      password: 's@mp1ePassword2'
    };

    user = new User({
      firstName: 'MEAN',
      lastName: 'JS',
      displayName: 'MEANJS',
      email: 'meanjs@test.com',
      username:credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    user2 = new User({
      firstName: 'MEAN2',
      lastName: 'JS2',
      displayName: 'MEANJS2',
      email: 'meanjs2@test.com',
      username:credentials2.username,
      password: credentials2.password,
      provider: 'local'
    });

    user.save(function() {
      user2.save(function() {
        listing = {
          title: 'Sample Listing',
          text: 'Hellow World',
          created_at: new Date()
        };
        done();
      });
    });
  });

  // HTTP POST /api/listings
  it('should be able to save a listing if logged in', function(done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signInErr, signInRes) {
        if(signInErr) {
          return done(signInErr);
        }

        var userId = user.id;

        agent.post('/api/listings')
          .send(listing)
          .expect(200)
          .end(function(listingSaveErr, listingSaveRes){
            if(listingSaveErr){
              return done(listingSaveErr);
            }
            Listing.find().exec(function(err, listings) {
              if(err) {
                return done(err);
              }
              (listings[0].author.toString()).should.equal(userId);
              (listings[0].title).should.match('Sample Listing');

              done();
            });
          });
      });
  });

  // HTTP GET /api/listings
  it('should be able to get a list of listings if logged in', function(done) {
    var listingObj = new Listing(listing);

    listingObj.save(function(){
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function(signInErr, signInRes) {
          if(signInErr) {
            return done(signInErr);
          }

          agent.get('/api/listings')
            .expect(200)
            .end(function(listingGetErr, listingGetRes) {
              if(listingGetErr) {
                return done(listingGetErr);
              }
              listingGetRes.body.should.be.instanceof(Array).and.have.lengthOf(1);

              done();
            });
        });
    });
  });
  // HTTP GET /api/listings/:listingID

  // HTTP DELETE /api/listings/:listingID
  it('should be able to delete a listing if logged in', function(done) {
    var listingObj = new Listing(listing);

    listingObj.save(function(){
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function(signInErr, signInRes) {
          if(signInErr) {
            return done(signInErr);
          }

          agent.delete('/api/listings/' + listingObj._id)
            .expect(200)
            .end(function(listingDeleteErr, listingDeleteRes) {
              if(listingDeleteErr) {
                return done(listingDeleteErr);
              }

              (listingDeleteRes.body._id).should.equal(listingObj._id.toString());

              done();
            });
        });
    });
  });

  it('should not be able to delete if not logged in', function(done){
    var listingObj = new Listing(listing);
    listingObj.author = user;
    listingObj.save(function(){
      agent.delete('api/listings/' + listingObj._id)
        .expect(403)
        .end(function(listingDeleteErr, listingDeleteRes){
          if(listingDeleteErr){
            return done(listingDeleteErr);
          }
          done();
        });
    });
  });

  it('should not be able to delete if logged in as another user', function(done){
    var listingObj = new Listing(listing);
    listingObj.author = user;
    listingObj.save(function(){
      agent.post('/api/auth/signin')
        .send(credentials2)
        .expect(200)
        .end(function(signInErr, singInRes){
          if(signInErr){
            return done(signInErr);
          }
        });
      agent.delete('api/listings/' + listingObj._id)
          .expect(403)
          .end(function(listingDeleteErr, listingDeleteRes){
            if(listingDeleteErr){
              return done(listingDeleteErr);
            }
            done();
          });
    });
  });
  // HTTP PUT /api/listings/:listingID

  afterEach(function(done) {
    User.remove().exec(function() {
      Listing.remove().exec(done);
    });
  });
});

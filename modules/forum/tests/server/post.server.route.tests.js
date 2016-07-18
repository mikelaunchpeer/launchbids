'use strict';

var should = require('should');
var request = require('supertest');
var path = require('path');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Post = mongoose.model('Post');
var express = require(path.resolve('./config/lib/express'));

// global variables
var app, agent, credentials, user, post, user2, credentials2;

// posts route Tests
describe('Post CRUD tests', function(){
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
        post = {
          title: 'Sample Post',
          text: 'Hellow World',
          created_at: new Date()
        };
        done();
      });
    });
  });

  // HTTP POST /api/posts
  it('should be able to save a post if logged in', function(done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signInErr, signInRes) {
        if(signInErr) {
          return done(signInErr);
        }

        var userId = user.id;

        agent.post('/api/posts')
          .send(post)
          .expect(200)
          .end(function(postSaveErr, postSaveRes){
            if(postSaveErr){
              return done(postSaveErr);
            }
            Post.find().exec(function(err, posts) {
              if(err) {
                return done(err);
              }
              (posts[0].author.toString()).should.equal(userId);
              (posts[0].title).should.match('Sample Post');

              done();
            });
          });
      });
  });

  // HTTP GET /api/posts
  it('should be able to get a list of posts if logged in', function(done) {
    var postObj = new Post(post);

    postObj.save(function(){
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function(signInErr, signInRes) {
          if(signInErr) {
            return done(signInErr);
          }

          agent.get('/api/posts')
            .expect(200)
            .end(function(postGetErr, postGetRes) {
              if(postGetErr) {
                return done(postGetErr);
              }
              postGetRes.body.should.be.instanceof(Array).and.have.lengthOf(1);

              done();
            });
        });
    });
  });
  // HTTP GET /api/posts/:postID

  // HTTP DELETE /api/posts/:postID
  it('should be able to delete a post if logged in', function(done) {
    var postObj = new Post(post);

    postObj.save(function(){
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function(signInErr, signInRes) {
          if(signInErr) {
            return done(signInErr);
          }

          agent.delete('/api/posts/' + postObj._id)
            .expect(200)
            .end(function(postDeleteErr, postDeleteRes) {
              if(postDeleteErr) {
                return done(postDeleteErr);
              }

              (postDeleteRes.body._id).should.equal(postObj._id.toString());

              done();
            });
        });
    });
  });

  it('should not be able to delete if not logged in', function(done){
    var postObj = new Post(post);
    postObj.author = user;
    postObj.save(function(){
      agent.delete('api/posts/' + postObj._id)
        .expect(403)
        .end(function(postDeleteErr, postDeleteRes){
          if(postDeleteErr){
            return done(postDeleteErr);
          }
          done();
        });
    });
  });

  it('should not be able to delete if logged in as another user', function(done){
    var postObj = new Post(post);
    postObj.author = user;
    postObj.save(function(){
      agent.post('/api/auth/signin')
        .send(credentials2)
        .expect(200)
        .end(function(signInErr, singInRes){
          if(signInErr){
            return done(signInErr);
          }
        });
      agent.delete('api/posts/' + postObj._id)
          .expect(403)
          .end(function(postDeleteErr, postDeleteRes){
            if(postDeleteErr){
              return done(postDeleteErr);
            }
            done();
          });
    });
  });
  // HTTP PUT /api/posts/:postID

  afterEach(function(done) {
    User.remove().exec(function() {
      Post.remove().exec(done);
    });
  });
});

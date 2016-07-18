'use strict';

describe('Forum E2E Tests', function() {
  var userCredentials = {
    firstName: 'test',
    lastName: 'test',
    email: 'forumE2Etest@launchbids.com',
    username: 'forumE2Etest',
    password: 'P@ssw0rd123'
  };

  describe('Navigate to Forum when signed out', function(){
    it('should redirect to signin page when going to /forum', function(){
      browser.get('http://localhost:3000/forum');
      expect(browser.getCurrentUrl()).toBe('http://localhost:3000/authentication/signin');
    });

    it('should redirect to signin page when going to /forum/create', function(){
      browser.get('http://localhost:3000/forum/create');
      expect(browser.getCurrentUrl()).toBe('http://localhost:3000/authentication/signin');
    });
  });

  describe('Forum when signed in', function(){
    it('should sign up and sign in ', function(){
      browser.get('http://localhost:3000/authentication/signup');
      element(by.model('credentials.firstName')).sendKeys(userCredentials.firstName);
      element(by.model('credentials.lastName')).sendKeys(userCredentials.lastName);
      element(by.model('credentials.email')).sendKeys(userCredentials.email);
      element(by.model('credentials.username')).sendKeys(userCredentials.username);
      element(by.model('credentials.password')).sendKeys(userCredentials.password);
      element(by.css('button[type="submit"]')).click();
      expect(browser.getCurrentUrl()).toBe('http://localhost:3000/');
    });

    it('should be able to access /forum', function(){
      browser.get('http://localhost:3000/forum');
      browser.wait(element(by.id('forum-header')).isPresent());
    });

    it('should be able to access /forum/create', function(){
      browser.get('http://localhost:3000/forum/create');
      browser.wait(element(by.id('create-header')).isPresent());
    });

    it('should be able to see an error if the title is blank', function(){
      element(by.model('text')).sendKeys('I forgot the title');
      element(by.css('button[type="submit"]')).click();
      // browser.pause();
      expect(element(by.css('.error-text')).getText()).toBe('Project Title is required.');
    });

    it('should be able to create a post', function(){
      browser.get('http://localhost:3000/forum/create');
      element(by.model('title')).sendKeys('Post Title');
      element(by.model('text')).sendKeys('I remembered the title');
      element(by.css('button[type="submit"]')).click();

      expect(browser.getCurrentUrl()).toBe('http://localhost:3000/forum');

      expect(element.all(by.repeater('post in posts')).count()).toBe(1);
    });

    it('should be able to delete a post', function(){
      browser.get('http://localhost:3000/forum');
      element(by.css('button.btn-danger')).click();

      expect(browser.getCurrentUrl()).toBe('http://localhost:3000/forum');

      expect(element.all(by.repeater('post in posts')).count()).toBe(0);
    });
  });
});

'use strict';

describe('Projects E2E Tests', function() {
  var userCredentials = {
    firstName: 'test',
    lastName: 'test',
    email: 'projectsE2Etest@launchbids.com',
    username: 'projectsE2Etest',
    password: 'P@ssw0rd123'
  };

  describe('Navigate to Projects when signed out', function(){
    it('should redirect to signin page when going to /projects', function(){
      browser.get('http://localhost:3000/projects');
      expect(browser.getCurrentUrl()).toBe('http://localhost:3000/authentication/signin');
    });

    it('should redirect to signin page when going to /projects/create', function(){
      browser.get('http://localhost:3000/projects/create');
      expect(browser.getCurrentUrl()).toBe('http://localhost:3000/authentication/signin');
    });
  });

  describe('Projects when signed in', function(){
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

    it('should be able to access /projects', function(){
      browser.get('http://localhost:3000/projects');
      browser.wait(element(by.id('projects-header')).isPresent());
    });

    it('should be able to access /projects/create', function(){
      browser.get('http://localhost:3000/projects/create');
      browser.wait(element(by.id('create-header')).isPresent());
    });

    it('should be able to see an error if the title is blank', function(){
      element(by.model('text')).sendKeys('I forgot the title');
      element(by.css('button[type="submit"]')).click();
      // browser.pause();
      expect(element(by.css('.error-text')).getText()).toBe('Project Title is required.');
    });

    it('should be able to create a listing', function(){
      browser.get('http://localhost:3000/projects/create');
      element(by.model('title')).sendKeys('Listing Title');
      element(by.model('text')).sendKeys('I remembered the title');
      element(by.css('button[type="submit"]')).click();

      expect(browser.getCurrentUrl()).toBe('http://localhost:3000/projects');

      expect(element.all(by.repeater('listing in listings')).count()).toBe(1);
    });

    it('should be able to delete a listing', function(){
      browser.get('http://localhost:3000/projects');
      element(by.css('button.btn-danger')).click();

      expect(browser.getCurrentUrl()).toBe('http://localhost:3000/projects');

      expect(element.all(by.repeater('listing in listings')).count()).toBe(0);
    });
  });
});

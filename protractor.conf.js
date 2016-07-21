'use strict';

// Protractor configuration
var config = {
  framework: 'jasmine2',
  specs: ['modules/projects/tests/e2e/*.js'],
};

if (process.env.TRAVIS) {
  config.capabilities = {
    browserName: 'firefox'
  };
} else {
  config.capabilities = {
    browserName: 'chrome'
  };
}

exports.config = config;

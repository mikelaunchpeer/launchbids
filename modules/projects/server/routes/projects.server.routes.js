'use strict';

var listings = require('../controllers/projects.server.controller.js');
var listingsAccessPolicy = require('../policies/listing.server.policy');

module.exports = function(app) {
  // Routing logic
  app.route('/api/listings').all(listingsAccessPolicy.isAllowed)
    .get(listings.list)
    .post(listings.create);

  app.route('/api/listings/:listingId').all(listingsAccessPolicy.isAllowed)
    .delete(listings.delete);

  app.param('listingId', listings.listingByID);
};

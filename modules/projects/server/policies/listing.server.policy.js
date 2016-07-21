'use strict';

var acl = require('acl');
acl = new acl(new acl.memoryBackend());

exports.invokeRolesPolicies = function(){
  acl.allow([{
    roles:['admin'],
    allows:[{
      resources:'/api/listings',
      permissions:'*'
    },{
      resources:'/api/listings/:listingId',
      permissions:'*'
    }]
  },{
    roles:['user'],
    allows:[{
      resources:'/api/listings',
      permissions:['get', 'post']
    }]
  }]);
};

exports.isAllowed = function(req,res,next){
  var roles = (req.user) ? req.user.roles : ['guest'];

  //handle deleste case
  if(req.listing && req.user && req.listing.author.id === req.user.id && req.method.toLowerCase() === 'delete'){
    return next();
  }
  //handle other cases
  acl.areAnyRolesAllowed(roles,req.route.path, req.method.toLowerCase(), function(err, isAllowed){
    if(err){
      return res.status(500).send('Unexpected authorization error');
    } else {
      if(isAllowed){
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};

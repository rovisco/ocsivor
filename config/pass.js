var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , db = require('./dbschema');
  
passport.serializeUser(function(user, done) {
  var createAccessToken = function () {
    var token = user.generateRandomToken();
    db.userModel.findOne( { accessToken: token }, function (err, existingUser) {
      if (err) { return done( err ); }
      if (existingUser) {
        createAccessToken(); // Run the function again - the token has to be unique!
      } else {
        user.set('accessToken', token);
        user.save( function (err) {
          if (err) return done(err);
          return done(null, user.get('accessToken'));
        })
      }
    });
  };

  if ( user._id ) {
    createAccessToken();
  }
});

passport.deserializeUser(function(token, done) {
  db.userModel.findOne( {accessToken: token } , function (err, user) {
    done(err, user);
  });
});


passport.use(new LocalStrategy(function(username, password, done) {
    console.log("Login with user: "+username); 
    db.userModel.findOne({ username: username }, function(err, user) {
    
    if (err) { return done(err); }
    if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
    user.comparePassword(password, function(err, isMatch) {
      if (err) return done(err);
      if(isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid password' });
      }
    });
  });
}));

// Simple route middleware to ensure user is authenticated.  Otherwise send to login page.
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

// Simple route middleware to ensure user is authenticated.  Otherwise send to login page.
exports.ensureAuthenticatedApi = function ensureAuthenticatedApi(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.send(403);
}

// Check for admin middleware, this is unrelated to passport.js
// You can delete this if you use different method to check for admins or don't need admins
exports.ensureAdmin = function ensureAdmin(req, res, next) {
    return function(req, res, next) {
	console.log(req.user);
        if(req.user && req.user.admin === true)
            next();
        else
            res.send(403);
    }
}



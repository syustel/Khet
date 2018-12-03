const LocalStrategy = require('passport-local').Strategy;

const User = require('../app/models/user');

module.exports = function (passport) {

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

 
  passport.use('local-signup', new LocalStrategy({
    
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true 
  },
  function (req, email, password, done) {
    User.findOne({'local.email': email}, function (err, user) {
      if (err) {
        return done(err);
      }
      if (user) {
        return done(null, false, req.flash('signupMessage', 'El email ya existe'));
      } else {
        var newUser = new User();
        newUser.local.email = email;
        newUser.local.password = newUser.encriptar(password);
        newUser.local.username = req.body.username;
        newUser.local.nationality = req.body.nationality;
        newUser.local.elo = req.body.elo;
        newUser.save(function (err) {
          if (err) { throw err; }
          return done(null, newUser);
        });
      }
    });
  }));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function (req, email, password, done) {
    User.findOne({'local.email': email}, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, req.flash('loginMessage', 'Usuario no existe'))
      }
      if (!user.validar(password)) {
        return done(null, false, req.flash('loginMessage', 'Constraseña invalida'));
      }
      return done(null, user);
    });
  }));


passport.use('local-ranking', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function (req, email, password, done) {
    User.findOne({'local.email': email}, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, req.flash('loginMessage', 'Usuario no existe'))
      }
      if (!user.validar(password)) {
        return done(null, false, req.flash('loginMessage', 'Constraseña invalida'));
      }
      return done(null, user);
    });
  }));
}

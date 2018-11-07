module.exports = (app, passport) => {

	
	app.get('/', (req, res) => {
		res.render('index');
	});

	
	app.get('/login', (req, res) => {
		res.render('login.ejs', {
			message: req.flash('loginMessage')
		});
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true
	}));

	
	app.get('/signup', (req, res) => {
		res.render('signup', {
			message: req.flash('signupMessage')
		});
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/login',
		failureRedirect: '/signup',
		failureFlash: true 
	}));



	
	app.get('/profile', isLoggedIn, (req, res) => {
		res.render('profile', {
			user: req.user
		});
	});

	app.get('/profile/ranking', isLoggedIn, (req, res) => {
		res.render('ranking', {
			user: req.user
		});
	});	

	app.get('/update', isLoggedIn, (req, res) => {
		res.render('update', {
			user: req.user
		});
	});

	app.post('/update', passport.authenticate('local-update', {
		successRedirect: '/profile',
		failureRedirect: '/update',
		failureFlash: true 
	}));

	
	app.get('/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});
};

function isLoggedIn (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}

	res.redirect('/');
}

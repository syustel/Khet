const User = require('../app/models/user');


function buscar(req,res){

    User.find(function (err, data) {
   

   	for (var i = 0; i < data.length; i++) {
	res.write( data[i].local.username + '\t' + data[i].local.elo + '\t' + data[i].local.email + '\n');
	}
    
    res.end();
    });

}


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

	app.post('/profile', isLoggedIn, (req, res) => {
		res.render('profile', {
			user: req.user
		});
	});	

	app.get('/profile/ranking', isLoggedIn, buscar, (req, res) => {
		res.render('ranking', {
			user: req.user
		});
	});

	app.get('/profile/ficha', isLoggedIn, (req, res) => {
		res.render('ficha', {
			user: req.user
		});
	});
	app.post('/profile/ficha', isLoggedIn, (req, res) => {
		res.render('ficha', {
			user: req.user
		});
	});

	app.get('/profile/ficha/update', isLoggedIn, (req, res) => {
		res.render('update', {
			user: req.user
		});
	});

//	app.post('/profile/:id', isLoggedIn, (req, res) => {
//		res.render('ficha', {
//			user: req.user
//		});
//	});

	app.put('/profile/:id', isLoggedIn, function(req, res) {
		var id = req.params.id;
		User.findOne({_id: id}, function(err,foundObject){
			if(err){
				console.log(err);
				res.status(500).send();
			}
			else {
				if(!foundObject){
					res.status(404).send();
				} else{
					if(req.body.username){
						foundObject.local.name = req.body.username;
					}
					if(req.body.email){
						foundObject.local.email = req.body.email;
					}
					if(req.body.nationality){
						foundObject.local.nationality = req.body.nationality;
					}
					foundObject.save(function(err,updateObject){
						if(err){
							console.log(err);
							res.status(500).send();
						}else{
							
							res.render('ficha', {
							user: updateObject
			});
						}


					});
				}
			}
		})
		
	});	

	
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

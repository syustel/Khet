var mongoose = require('mongoose')
var User = mongoose.model('User')

//POST - AddUser
exports.addUser = function(req, res) {
  console.log("hola");
  console.log(req.body);

  //User model instance
  var user = new User({
    name: req.body.name,
    email: req.body.email
    //name: "yuste",
    //email: "yuste@a.com"
  })

  //'save' method is an abstraction of 'insert' method from mongodb
  user.save(function(err, user) {
    if(err) return res.send(400, err.message)
    res.status(200).jsonp(user)
  })
}

//GET - Show all users
exports.showAll = function(req, res) {
  //'find' is an abstraction of 'find' method from mongodb
  User.find(function(err, users) {
    if(err) res.send(400, err.message)
    res.status(200).jsonp(users)
    //res.status(200).sendFile(__dirname + '/../ranking.html');
  })
}

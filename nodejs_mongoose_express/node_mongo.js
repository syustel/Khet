/**
 ** We import all the libraries that we'll use
 **/
var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')

//instance of express framework
var app = express()

//MongoDB database url. In this case, we have a db named 'users'
var url = 'mongodb://localhost/users'

//We use bodyParser to provide fast json parsing of body data of the request
app.use(bodyParser.json())

//If we manage the root behaviour, we should implement this
app.get('/', function (request, response) {
  response.sendFile(__dirname + '/index.html');
})

//Connection to mongodb using mongoose
mongoose.connect(url, function(error, response) {
  if(error) throw error
  console.log('CONECTADOS A LA DB');
})

//Here we declarate all models and controllers that our application will use
var models = require('./models/user')
var userController = require('./controller/userController')

//Router allow to us to easily match the endpoint with their respective controller
var api = express.Router()
api.route('/addUser').post(userController.addUser)
api.route('/showAll').get(userController.showAll)

//After we define our routes, we have to tell to express that we shall use our 'routes', starting over root
app.use('/', api);


//Server will listen over $PORT specified on first parameter
app.listen(3000, function () {
  console.log('Servidor inicializado en puerto 3000');
})

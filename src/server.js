var express = require('express');
var app = express();

const methodOverride = require('method-override');

var http = require('http').Server(app);
var io = require('socket.io')(http);


var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
 session = require('express-session');

var { url } = require('./config/database.js');

mongoose.connect(url, {
	useMongoClient: true
});

require('./config/passport')(passport);


app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
	secret: 'khet',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(methodOverride('_method'));


require('./app/routes.js')(app, passport);

app.use(express.static(path.join(__dirname, 'public')));

http.listen(process.env.PORT || '3000');


var games = [];

io.on('connection', function(socket){
  console.log('a user connected: ' + socket.id);

  socket.on('gameCreated', function() {
    games.push(socket.id);
  });

  socket.on('searchGame', function(){
    io.to(socket.id).emit('gamesFound', games);
  });

  socket.on('guestArrive', function(oponent){
    io.to(oponent).emit('oponentArrive', socket.id);
  });

  socket.on('play', function(cellX, cellY, oponent) {
    io.to(socket.id).emit('play', cellX, cellY);
    io.to(oponent).emit('play', cellX, cellY);
  });



  ////////////sokcets viejos
  /*
  socket.on('playerArrives', function(){
    //console.log(socket.id);
    if (!playersID[0]) {
      playersID[0] = socket.id;
      //io.emit('playerReady');
      io.to(socket.id).emit('playerReady', 'O')
      //console.log("playerReady");
    }
    else if (!playersID[1] && playersID[0]!=socket.id) {
      playersID[1] = socket.id;
      io.to(socket.id).emit('playerReady', 'X')
      //io.emit('playerReady');
    }
    //if (!playersID[p]) {
    //  playersID[p] = socket.id;
    //  io.emit('playerReady', p);
    //}
  });

  socket.on('move', function(cellX, cellY){
    //console.log(cellX + cellY);
    if (socket.id == playersID[turn]) {
      //console.log("move");
      turn = (turn + 1) % 2;
      var p = turn * (-2) + 1;
      io.emit('move', cellX, cellY, p);
      
    }
  });
  */

});


//app.listen(app.get('port'), () => {
//	console.log('server on port ', app.get('port'));
//});

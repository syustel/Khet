var app = require('http').createServer(handleRequest)
var io = require('socket.io')(app);
var fs = require('fs');
var path = require('path');

app.listen(8080);
console.log('listening on *:8080');

function handleRequest(req, res){
    // What did we request?
  var pathname = req.url;
  
  // If blank let's ask for index.html
  if (pathname == '/') {
    pathname = '/index.html';
  }
  
  // Ok what's our file extension
  var ext = path.extname(pathname);

  // Map extension to file type
  var typeExt = {
    '.html': 'text/html',
    '.js':   'text/javascript',
    '.css':  'text/css'
  };
  // What is it?  Default to plain text

  var contentType = typeExt[ext] || 'text/plain';

  // User file system module
  
  fs.readFile(__dirname + pathname,
    // Callback function for reading
    function (err, data) {
      // if there is an error
      if (err) {
        res.writeHead(500);
        return res.end('Error loading ' + pathname);
      }
      // Otherwise, send the data, the contents of the file
      res.writeHead(200,{ 'Content-Type': contentType });
      res.end(data);
    }
  );
  //res.sendFile(__dirname + '/index.html');
}


io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('clicked', function(msg){
    console.log('message: ' + msg);
    io.emit('todos', msg);
  });
});

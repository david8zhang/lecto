// Require HTTP module (to start server) and Socket.IO
var http = require('http'), io = require('socket.io');

// Start the server at port 8080
var server = http.createServer(function(req, res){ 

	// Send HTML headers and message
	res.writeHead(200,{ 'Content-Type': 'text/html' }); 
	res.end('<h1>Hello Socket Lover!</h1>');
});
server.listen(process.env.PORT || 8080, '0.0.0.0');

// Create a Socket.IO instance, passing it our server
var socket = io.listen(server);

// Add a connect listener
socket.on('connection', function(client){ 

	socket.emit('message', 'You are connected!');
	
	// Success!  Now listen to messages to be received
	client.on('message',function(event){ 
		socket.emit('message', event);
		//console.log('Received message from client!',event);
	});
	client.on('disconnect',function(){
		console.log('Server has disconnected');
	});

});

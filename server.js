var express = require('express');
var stylus = require('stylus');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();

function compile(str, path){
	return stylus(str).set('filename', path);
}


app.set('views', __dirname + '/server/views');
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(stylus.middleware(
			{
				src : __dirname +'/public',
				compile: compile
			}
));
app.use(express.static(__dirname + '/public'));
if(env === 'development'){
		mongoose.connect('mongodb://localhost/multivision');
}
else{
	 mongoose.connect(' mongodb://heroku_57pmxv05:sfudefleigchkvjv9hia2849af@ds017173.mlab.com:17173/heroku_57pmxv05');
}
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error...'));
db.on('open', function callback(){
	console.log('mongodb opend')
})

var port = process.env.PORT || 3030;
app.listen(port, function(){
		console.log('Listening on port ' + port + '...');
});



var messageSchema = mongoose.Schema(
	{
		message : String
	}
);
var Message = mongoose.model('Message', messageSchema);
var mongoMessage;
Message.findOne().exec(function(err, messageDoc){
	mongoMessage = messageDoc.message;
});


app.get('/partials/:partialPath', function(req, res){
	res.render('partials/' + req.params.partialPath);
});

app.get('*', function(req, res){
		res.render('index',{
			mongoMessage : mongoMessage
		});
});

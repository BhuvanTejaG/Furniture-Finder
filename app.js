var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();
var ejs = require("ejs");
var session = require('express');
var MongoClient = require('mongodb').MongoClient;
var os = require('os');
var ifaces = os.networkInterfaces();

// all environments
app.use(express.cookieParser());
app.use(express.session({secret:'personal',cookie:{maxAge:60000}}));
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.session({secret: 'adfasdf34efsdfs34sefsdf'}));

//app.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'ngSanitize']);

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res){
	res.render('mainpage', { title: 'furniture' });
});

app.get('/getAll', function(req, res){
	MongoClient.connect("mongodb://172.31.33.200:27020/store", function(err, db) {
		if(err) { return console.dir(err); }
		var collection = db.collection('furniture');
		console.log("In getAll");
		collection.find().toArray(function(err, docs) {
			console.log(docs);    		      
			res.send({"response":"Success","results":docs});
		});
	});
});

app.get('/getProductDetails/:productName', function(req, res){
console.log("HI");
	var productName = req.param("productName");
	MongoClient.connect("mongodb://172.31.33.200:27020/store", function(err, db) {
		if(err) { return console.dir(err); }
		var collection = db.collection('furniture');
		console.log(productName);
		collection.find({"name":productName}).toArray(function(err, docs) {
			console.log(docs);
			res.send({"response":"Success","results":docs});
        });
	});
});

app.get('/getIP', function(req, res){
	var i=0;
	Object.keys(ifaces).forEach(function (ifname) {
		ifaces[ifname].forEach(function (iface) {
	    if ('IPv4' !== iface.family || iface.internal !== false) {
	      return;
	    }
		console.log("ipaddress: "+iface.address);
		res.send({"ipaddress":iface.address});
	  });
	});
	//res.send({"ipaddress":ipaddress});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

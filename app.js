/**
 * Created by admin on 15-4-28.
 */


var express = require('express'),
	db = require('./db');

var app = express();


app.all('/', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Content-type", "application/json");
	next();
});



app.get('/all', db.findAll);
app.get('/one/:id', db.findById);
app.get('/add',db.addItem);


app.listen(3000);
console.log('Listening on port 3000...');


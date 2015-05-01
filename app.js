/**
 * Created by admin on 15-4-28.
 */


var express = require('express'),
	youpingDB = require('./dbs/youping'),
	wuyiDB = require('./dbs/wuyi');

var app = express();


app.all('/', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Content-type", "application/json");
	next();
});

app.get('/all', youpingDB.findAll);
app.get('/one', youpingDB.findById);
app.get('/add',youpingDB.addItem);

app.get('/wuyi/all', wuyiDB.findAll);
app.get('/wuyi/add',wuyiDB.addItem);


app.listen(3000);
console.log('Listening on port 3000...');


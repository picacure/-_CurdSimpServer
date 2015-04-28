/**
 * Created by admin on 15-4-28.
 */


var express = require('express'),
	items = require('./db');

var app = express();

app.get('/items', items.findAll);
app.get('/items/:id', items.findById);
app.get('/items/add/:id', items.addItem);

app.listen(3000);
console.log('Listening on port 3000...');


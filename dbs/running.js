/**
 * Created by admin on 15-4-28.
 */

var mongo = require('mongodb');

var Server = mongo.Server,
	Db = mongo.Db,
	BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('running', server);

db.open(function (err, db) {
	if (!err) {
		console.log("Connected to 'running' database");
		db.collection('items', {strict: true}, function (err, collection) {
			if (err) {
				console.log("The 'items' collection doesn't exist. Creating it with sample data...");
				populateDB();
			}
		});
	}
});

exports.findByIdAndWeek = function (req, res) {
	var q = req.query;
	var wxId = q.wxId;
	var weekOfYear = q.weekOfYear;
	console.log('Retrieving item: ' + wxId);
	db.collection('items', function (err, collection) {

		collection.find({'wxId': wxId, 'weekOfYear': weekOfYear}).toArray(function (err, result) {

			if (err) {
				res.send({'error': 'An error has occurred'});
				console.log("findById error");
			} else {
				res.send(q.callback + '('+ JSON.stringify(result) + ');');

				console.log("findById result: " + result);
			}
		});
	});
};


exports.findById = function (req, res) {
	var q = req.query;
	var wxId = q.wxId;
	console.log('Retrieving item: ' + wxId);
	db.collection('items', function (err, collection) {

		collection.find({'wxId': wxId}).toArray(function (err, result) {

			if (err) {
				res.send({'error': 'An error has occurred'});
				console.log("findById error");
			} else {
				res.send(q.callback + '('+ JSON.stringify(result) + ');');

				console.log("findById result: " + result);
			}
		});
	});
};

exports.findByWeek = function (req, res) {
	var q = req.query;
	var weekOfYear = q.weekOfYear;
	console.log('Retrieving item: ' + weekOfYear);
	db.collection('items', function (err, collection) {

		collection.find({'weekOfYear': weekOfYear}).toArray(function (err, result) {

			if (err) {
				res.send({'error': 'An error has occurred'});
				console.log("findById error");
			} else {
				res.send(q.callback + '('+ JSON.stringify(result) + ');');

				console.log("findById result: " + result);
			}
		});
	});
};

exports.findAll = function (req, res) {
	//JsonP
	var q = req.query;

	db.collection('items', function (err, collection) {
		collection.find().toArray(function (err, items) {
			res.send(q.callback + '('+ JSON.stringify(items) + ');');
		});
	});
};

function getYearWeek(date){
	var date2 = new Date(date.getFullYear(),0,1);
	var day1 = date.getDay();
	if(day1 == 0) day1 = 7;

	var day2 = date2.getDay();
	if(day2 == 0) day2 = 7;

	var d = Math.round((date.getTime() - date2.getTime() + (day2 - day1) * (24*60*60*1000))/86400000);

	return Math.ceil(d/7) + 1;
}

exports.addItem = function (req, res) {

	var q = req.query;
	console.log('Adding item: ' + JSON.stringify(q))

	var weekOfYear = getYearWeek(new Date());

	var item = {
		wxId: q.wxId,
		miles: q.miles,
		weekOfYear: weekOfYear
	};

	db.collection('items', function (err, collection) {
		collection.insert(item, {safe: true}, function (err, result) {
			if (err) {
				res.send({'error': 'An error has occurred'});
			} else {
				res.send(q.callback + '('+ JSON.stringify({ ok: 'OK'}) + ');');
			}
		});
	});

}

exports.updateItem = function (req, res) {


	var id = req.params.id;
	var item = req.body;
	console.log('Updating item: ' + id);
	console.log(JSON.stringify(item));
	db.collection('items', function (err, collection) {
		collection.update({'_id': new BSON.ObjectID(id)}, item, {safe: true}, function (err, result) {
			if (err) {
				console.log('Error updating item: ' + err);
				res.send({'error': 'An error has occurred'});
			} else {
				console.log('' + result + ' document(s) updated');
				res.send(item);
			}
		});
	});
}

exports.deleteitem = function (req, res) {
	var id = req.params.id;
	console.log('Deleting item: ' + id);
	db.collection('items', function (err, collection) {
		collection.remove({'_id': new BSON.ObjectID(id)}, {safe: true}, function (err, result) {
			if (err) {
				res.send({'error': 'An error has occurred - ' + err});
			} else {
				console.log('' + result + ' document(s) deleted');
				res.send(req.body);
			}
		});
	});
}

var populateDB = function () {

	var cell = [
		{
			wxId: "13378628902",
			miles: "10",
			weekOfYear: 22
		}
	];

	db.collection('items', function (err, collection) {
		collection.insert(cell, {safe: true}, function (err, result) {
			if(err){
				console.log("populate error when insert");
			}
			else{
				console.log("populate success");
			}
		});
	});

};

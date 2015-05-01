/**
 * Created by admin on 15-5-1.
 */

/**
 * Created by admin on 15-4-28.
 */

var mongo = require('mongodb');

var Server = mongo.Server,
	Db = mongo.Db,
	BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('wuyi', server);

db.open(function (err, db) {
	if (!err) {
		console.log("Connected to 'wuyi' database");
		db.collection('items', {strict: true}, function (err, collection) {
			if (err) {
				console.log("The 'items' collection doesn't exist. Creating it with sample data...");
				populateDB();
			}
		});
	}
});


exports.findAll = function (req, res) {
	//JsonP
	var q = req.query;

	db.collection('items', function (err, collection) {
		collection.find().toArray(function (err, items) {
			if (q.callback) {
				res.send(q.callback + '(' + JSON.stringify(items) + ');');
			}
			else {
				res.send(items);
			}
		});
	});

};

exports.addItem = function (req, res) {

	var q = req.query;
	console.log('Adding item: ' + JSON.stringify(q));

	var item = {
		"photo": q.photo,
		"lon": q.loc.lon,
		"lat": q.loc.lat
	};

	db.collection('items', function (err, collection) {
		collection.insert(item, {safe: true}, function (err, result) {
			if (err) {
				res.send({'error': 'An error has occurred'});
			} else {
				res.send(q.callback + '(' + JSON.stringify({ ok: 'OK'}) + ');');
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
			"photo": "http://wx.qlogo.cn/mmopen/utpKYf69VAbCRDRlbUsPsdQN38DoibCkrU6SAMCSNx558eTaLVM8PyM6jlEGzOrH67hyZibIZPXu4BK1XNWzSXB3Cs4qpBBg18/0",
			"lon": 122.89,
			"lat": 34.67
		}
	];

	db.collection('items', function (err, collection) {
		collection.insert(cell, {safe: true}, function (err, result) {
			if (err) {
				console.log("populate error when insert");
			}
			else {
				console.log("populate success");
			}
		});
	});

};

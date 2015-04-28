/**
 * Created by admin on 15-4-28.
 */

var mongo = require('mongodb');

var Server = mongo.Server,
	Db = mongo.Db,
	BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('youjin', server);

db.open(function (err, db) {
	if (!err) {
		console.log("Connected to 'youjin' database");
		db.collection('items', {strict: true}, function (err, collection) {
			if (err) {
				console.log("The 'items' collection doesn't exist. Creating it with sample data...");
				populateDB();
			}
		});
	}
});

exports.findById = function (req, res) {
	var id = req.params.id;
	console.log('Retrieving item: ' + id);
	db.collection('items', function (err, collection) {
		collection.findOne({'_id': new BSON.ObjectID(id)}, function (err, item) {
			res.send(item);
		});
	});
};

exports.findAll = function (req, res) {
	db.collection('items', function (err, collection) {
		collection.find().toArray(function (err, items) {
			res.send(items);
		});
	});
};

exports.addItem = function (req, res) {
	var id = req.params.id;
	console.log('Adding item id: ' + JSON.stringify(id));

	var item = [{
		phone: id,
		comments: [
			{
				who: "18908333212",
				rank: 0,
				comment: "这个家伙是个坏蛋",
				support: 10,
				against: 9,
				time: "2012-3-19:9:10"
			}
		]
	}];

	db.collection('items', function (err, collection) {
		collection.insert(item, {safe: true}, function (err, result) {
			if (err) {
				res.send({'error': 'An error has occurred'});
			} else {
				console.log('Success: ' + JSON.stringify(result[0]));
				res.send(result[0]);
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
			phone: "13378628902",
			comments: [
				{
					who: "18908333212",
					rank: 0,
					comment: "这个家伙是个坏蛋",
					support: 10,
					against: 9,
					time: "2012-3-19:9:10"
				},
				{
					who: "11208333212",
					rank: 10,
					comment: "这个家伙是个好人",
					support: 10,
					against: 9,
					time: "2012-3-19:9:10"
				}
			]
		},
		{
			phone: "13178628902",
			comments: [
				{
					who: "10908333212",
					rank: 0,
					comment: "这个家伙是个gay",
					support: 10,
					against: 9,
					time: "2012-3-19:9:10"
				},
				{
					who: "13208333212",
					rank: 10,
					comment: "这个家伙是个拉拉",
					support: 10,
					against: 9,
					time: "2012-3-19:9:10"
				}
			]
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

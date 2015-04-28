/**
 * Created by admin on 15-4-28.
 */

exports.findAll = function(req, res) {
	res.send([{name:'item1'}, {name:'item2'}, {name:'item3'}]);
};

exports.findById = function(req, res) {
	res.send({id:req.params.id, name: "The Name", description: "description"});
};


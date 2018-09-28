var mongoose = require('mongoose');


//Send us form Schema
var SendusSchema = mongoose.Schema({
	type: {
		type: String,
		index:true
	},
	goods: {
		type: String
	},
	wherefrom: {
		type: String
	},
	whereto: {
		type: String
	},
	paymethod: {
		type: String
    },
    amount: {
        type: String
    }
});

var Sendus = module.exports = mongoose.model('SendusInfo', SendusSchema);

module.exports.createInfo = function(newInfo, callback){
   
	        newInfo.save(callback);
	 console.log('send us form saved')

}

module.exports.getSendusInfoByType = function(username, callback){
	var query = {type: type};
	SendusInfo.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}


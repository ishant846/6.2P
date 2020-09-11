const mongoose = require('mongoose');
const bcrypt =  require('bcrypt');
const crypto = require('crypto');

const WorkerSchema = mongoose.Schema({
	first_name : {type : String, default : ''},
    last_name : {type : String, default : ''},
    
	email : {type : String, unique : true, required: true},
    password : {type : String, default : ''},
	
	country: {type : String, default : ''},

	address: {type : String, default : ''},
	contact_number: { type: String, default: '' },
});

WorkerSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

WorkerSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}


module.exports = mongoose.model('Worker', WorkerSchema);
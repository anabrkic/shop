var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userProfileSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    firstname: {type: String, required: true},
    surname: {type: String, required: true},
    phone: {type: String},
    address: {type: String, required: true},
    city: {type: String, required: true},
    secondary_address: {type: String},
    secondary_city: {type: String},
});

module.exports = mongoose.model('UserProfile', userProfileSchema);
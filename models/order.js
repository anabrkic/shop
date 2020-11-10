/*var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    cart: {type: Object, required: true},
    status: {type: String},
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);*/
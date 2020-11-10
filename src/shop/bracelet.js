const mongoose = require('mongoose');

var braceletSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    price: {
        type: Number,
        require: true,
    },
    image_url: {
        type: String,
        require: true,
    },
    color:{
        type: String,
    },
    description:{
        type: String,
    },
});

var bracelet = mongoose.model('bracelet', braceletSchema);

module.exports = { bracelet, braceletSchema };
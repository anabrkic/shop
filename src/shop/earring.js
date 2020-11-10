const mongoose = require('mongoose');

var earringSchema = new mongoose.Schema({
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

var earring = mongoose.model('earring', earringSchema);

module.exports = { earring, earringSchema };
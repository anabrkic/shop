const mongoose = require('mongoose');

var necklaceSchema = new mongoose.Schema({
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

var necklace = mongoose.model('necklace', necklaceSchema);

module.exports = { necklace, necklaceSchema };
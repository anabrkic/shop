const mongoose = require('mongoose');

var ringSchema = new mongoose.Schema({
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

var ring = mongoose.model('ring', ringSchema);

module.exports = { ring, ringSchema };
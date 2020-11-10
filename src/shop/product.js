const mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
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
    description:{
        type: String,
    },
    color:{
        type: String,
    },
});

var product = mongoose.model('product', productSchema);

module.exports = { product, productSchema };

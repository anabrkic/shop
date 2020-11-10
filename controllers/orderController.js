const express= require('express');
const Handlebars = require('handlebars');
const mongoose= require('mongoose');
var products = require('../src/shop/product');
var rings = require('../src/shop/ring');
var earrings = require('../src/shop/earring');
var bracelets = require('../src/shop/bracelet');
var necklaces = require('../src/shop/necklace');
var userprofiles = require('../models/userprofile');
var router= express.Router()
//mongoose.set('useFindAndModify', false);
var assert = require('assert');
var Cart = require('../models/cart');
var Order = require('../models/order');
var user = require('../models/user');
var csrf = require('csurf');
var paginate = require('handlebars-paginate');
Handlebars.registerHelper('paginate', paginate);
const bodyParser= require('body-parser');
var csrfProtection = csrf();
router.use(csrfProtection);
var passport = require('passport');
var flash = require('connect-flash');
const product = require('../src/shop/product');
const ring = require('../src/shop/ring');
const earring = require('../src/shop/earring');
const bracelet = require('../src/shop/bracelet');
const necklace = require('../src/shop/necklace');
//const userprofile = require('../models/userprofile');
const { title } = require('process');
//var parseForm = bodyParser.urlencoded({ extended: false});
/* 
router.get('/user/profile', isLoggedIn, function(req, res, next){
    Order.order.find({user: req.user}, function(err, orders) {
        if (err) {
            return res.write('Error!');
        }
        var cart;
        orders.order.forEach(function(order) {
            cart = new Cart(older.cart);
            older.items = cart.generateArray();
        });
        res.render('user/profile', { orders : orders })
    });
});*/
/* putanje za prijavljenje korisnike */
router.get('/user/orders', isLoggedIn, function(req, res, next){
    res.render('user/orders');
});
router.get('/user/profilee', isLoggedIn, function(req, res, next){
    userprofiles.find({user: req.user}, function(err, userprofile){
        if (err) {
            return res.write('Error!');
        }
        res.render('user/profilee', { profile : userprofile });
    }).lean();
});
router.get('/user/createprofile', isLoggedIn, function(req, res, next){
    res.render('user/createprofile');
});
router.post('/user/createprofile', function(req, res, next) {
    Userprofile.create({
        source: req.body.userprofileToken
    }, function (err, userprofile){
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/user/createprofile');
        }
        var userprofile = new Userprofile({
            user: req.user,
            firstname: req.body.firstname,
            surname: req.body.surname,
            phone: req.body.phone,
            address: req.body.address,
            city: req.body.city
        });
        userprofile.save(function(err, result) {
            res.redirect('user/profilee');
        });
    })
    
    res.redirect('user/profilee');
});
router.get('/user/editprofile', isLoggedIn, csrfProtection, function(req, res, next){
    userprofiles.find({user: req.user}, function(err, userprofile){
        if (err) {
            return res.write('Error!');
        }
        res.render('user/editprofile', { profile : userprofile, csrfToken: req.csrfToken() });
    }).lean();
});
router.post('/user/editprofile', csrfProtection, function(req, res, next) {
    userprofiles.find({user: req.user}, function (err, doc){
        if (err) {
            return res.write('Error!');
        }
        //source: req.body.userprofileToken;
        doc.firstname = req.body.firstname;
        doc.surname = req.body.surname;
        doc.phone = req.body.phone;
        doc.address = req.body.address;
        doc.city = req.body.city;
        doc.save();
    }).lean();
    
    res.redirect('user/profilee');
    /*const db = mongoose.connection
    db.once('open', async () => {
        if (await userprofiles.countDocuments().exec() > 0) return
        
        Promise.all([
            userprofile.create({
                firstname: req.body.firstname,
                surname: req.body.surname,
                phone: req.body.phone,
                address: req.body.address,
                city: req.body.city,
            }).then(() => console.log("Profile created"))
        ]);
    })*/
});

router.get('/',(req,res)=>{
    res.render('home');
});
router.get('/products', function(req,res,next){
    products.product.find(function(err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize){
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('products', { products: productChunks });
    }).lean();
});
router.get('/shop/rings', function(req,res,next){
    rings.ring.find(function(err, docs) {
        var ringChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize){
            ringChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/rings', { rings: ringChunks });
    }).lean();
});

router.get('/shop/earrings', function(req,res,next){
    earrings.earring.find(function(err, docs) {
        var earringChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize){
            earringChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/earrings', { earrings: earringChunks });
    }).lean();
});

router.get('/shop/bracelets', function(req,res,next){
    bracelets.bracelet.find(function(err, docs) {
        var braceletChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize){
            braceletChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/bracelets', { bracelets: braceletChunks });
    }).lean();
});

router.get('/shop/necklaces', function(req,res,next){
    necklaces.necklace.find(function(err, docs) {
        var necklaceChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize){
            necklaceChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/necklaces', { necklaces: necklaceChunks });
    }).lean();
});

router.get('/add-to-cart/:id', function(req, res, next){
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    products.product.findById(productId, function(err, product) {
        if (err) {
            return res.redirect('/');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/products');
    });
});
router.get('/rings/add-to-cart/:id', function(req, res, next){
    var ringId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    rings.ring.findById(ringId, function(err, ring) {
        if (err) {
            return res.redirect('/');
        }
        cart.add(ring, ring.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/shop/rings');
    });
});

router.get('/earrings/add-to-cart/:id', function(req, res, next){
    var earringId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    earrings.earring.findById(earringId, function(err, earring) {
        if (err) {
            return res.redirect('/');
        }
        cart.add(earring, earring.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/shop/earrings');
    });
});

router.get('/bracelets/add-to-cart/:id', function(req, res, next){
    var braceletId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    bracelets.bracelet.findById(braceletId, function(err, bracelet) {
        if (err) {
            return res.redirect('/');
        }
        cart.add(bracelet, bracelet.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/shop/bracelets');
    });
});

router.get('/necklaces/add-to-cart/:id', function(req, res, next){
    var necklaceId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    necklaces.necklace.findById(necklaceId, function(err, necklace) {
        if (err) {
            return res.redirect('/');
        }
        cart.add(necklace, necklace.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/shop/necklaces');
    });
});

router.get('/add/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.addByOne(productId);
    req.session.cart = cart;
    res.redirect('/cart');
});

router.get('/reduce/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/cart');
});

router.get('/remove/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/cart');
});

router.get('/cart',(req,res)=>{
    if (!req.session.cart) {
        return res.render('cart', {products: null});
    }
    var cart = new Cart(req.session.cart);
    res.render('cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/checkout', isSignIn, (req,res)=>{
    if (!req.session.cart) {
        return res.redirect('/cart');
    }
    var cart = new Cart(req.session.cart);
    res.render('checkout', {total: cart.totalPrice});
});

router.post('/checkout', isSignIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/cart');
    }
    var cart = new Cart(req.session.cart);

    /*var order = new Order({
        user: req.user,
        cart: cart,
        firstname: req.body.firstname,
        surname: req.body.surname,
        address: req.body.address,
        city: req.body.city,
    });
    Order.order.save(function(err, result) {
        if (err){
            console.log("error");
            res.redirect('/checkout');
        }
        req.flash('success', 'Successfull shopping!');
        req.session.cart = null;
        res.redirect('/');
    });*/
});

router.get('/orders',(req,res)=>{
    res.render('orders');
});
router.get('/logout', isLoggedIn,function(req, res, next) {
    req.logout();
    req.session.cart = null;
    res.redirect('/');
});

/* putanje za neprijavljene korisnike */
router.use('/', notLoggedIn, function(req, res, next) {
    next();
});
router.get('/',(req,res)=>{
    res.render('home');
});

router.get('/user/signup', notLoggedIn, function(req, res, next) {
    var messages = req.flash('error');
    res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});
router.post('/user/signup', notLoggedIn, passport.authenticate('local.signup', {
    failureRedirect: '/user/signup',
    failureFlash: true
}), function (req, res, next) {
    if(req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/');
    }
});

router.get('/user/signin', function(req, res, next){
    var messages = req.flash('error');
    res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/user/signin', passport.authenticate('local.signin',{
    failureRedirect: '/user/signin',
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/');
    }
});

router.get('/products', function(req,res,next){
    products.product.find(function(err, docs) {
        res.render('products', { products: docs });
    }).lean();
});

router.get('/product', function(req,res,next){
    res.render('productssss');
});

router.get('/shop/rings', function(req,res,next){
    rings.ring.find(function(err, docs) {
        var ringChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize){
            ringChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/rings', { rings: ringChunks });
    }).lean();
});

router.get('/shop/earrings', function(req,res,next){
    earrings.earring.find(function(err, docs) {
        var earringChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize){
            earringChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/earrings', { earrings: earringChunks });
    }).lean();
});

router.get('/shop/bracelets', function(req,res,next){
    bracelets.bracelet.find(function(err, docs) {
        var braceletChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize){
            braceletChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/bracelets', { bracelets: braceletChunks });
    }).lean();
});

router.get('/shop/necklaces', function(req,res,next){
    necklaces.necklace.find(function(err, docs) {
        var necklaceChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize){
            necklaceChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/necklaces', { necklaces: necklaceChunks });
    }).lean();
});

router.get('/product', function(req,res,next){
    res.render('productssss');
});  

router.get('/add-to-cart/:id', function(req, res, next){
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    products.product.findById(productId, function(err, product) {
        if (err) {
            return res.redirect('/');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/products');
    });
});

router.get('/rings/add-to-cart/:id', function(req, res, next){
    var ringId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    rings.ring.findById(ringId, function(err, ring) {
        if (err) {
            return res.redirect('/');
        }
        cart.add(ring, ring.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/shop/rings');
    });
});

router.get('/earrings/add-to-cart/:id', function(req, res, next){
    var earringId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    earrings.earring.findById(earringId, function(err, earring) {
        if (err) {
            return res.redirect('/');
        }
        cart.add(earring, earring.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/shop/earrings');
    });
});

router.get('/bracelets/add-to-cart/:id', function(req, res, next){
    var braceletId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    bracelets.bracelet.findById(braceletId, function(err, bracelet) {
        if (err) {
            return res.redirect('/');
        }
        cart.add(bracelet, bracelet.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/shop/bracelets');
    });
});

router.get('/necklaces/add-to-cart/:id', function(req, res, next){
    var necklaceId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    necklaces.necklace.findById(necklaceId, function(err, necklace) {
        if (err) {
            return res.redirect('/');
        }
        cart.add(necklace, necklace.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/shop/necklaces');
    });
});

router.get('/cart',(req,res)=>{
    if (!req.session.cart) {
        return res.render('cart', {products: null});
    }
    var cart = new Cart(req.session.cart);
    res.render('cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/checkout', isSignIn, (req,res)=>{
    if (!req.session.cart) {
        return res.redirect('/cart');
    }
    var cart = new Cart(req.session.cart);
    res.render('checkout', {total: cart.totalPrice});
});

router.post('/checkout', isSignIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/cart');
    }
    var cart = new Cart(req.session.cart);

    /*var order = new Order({
        user: req.user,
        cart: cart,
        firstname: req.body.firstname,
        surname: req.body.surname,
        address: req.body.address,
        city: req.body.city,
    });
    order.save(function(err, result) {
        if (err){
            console.log("error");
            res.redirect('/checkout');
        }
        req.flash('success', 'Successfull shopping!');
        req.session.cart = null;
        res.redirect('/');
    });*/
});


module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function isSignIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}
/*ako chech out ne bude radio a profile bude promjeniti da se provjerava s funkcijom loggedIn a ne SignIn*/

/*function paginatedData(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const results = {};

        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            };
        }
        if (endIndex < await model.countDocuments().exec()) {
            result.next = {
                page: page + 1,
                limit: limit
            };
        }
        try {
            results.result = await model.find().limit(limit).skip(startIndex).exec()
            res.paginatedResult = results
            next();
        }catch (err) {
            res.status(500).json({message:err.message})
        }
        
    }
}*/
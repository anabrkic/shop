const express = require('express');
const path = require('path');
var cookieParser = require('cookie-parser');
var csrf = require('csurf');
var logger = require('morgan');
const bodyparser= require('body-parser');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);

const orderController = require('./controllers/orderController');
const adminRouter = require('./src/admin');
const bodyParser = require('body-parser');
var app= express();
const port = 3000;
/*app.use(bodyparser.urlencoded({
    extended: true
}));*/

process.setMaxListeners(Infinity);

let run = async () => {
    return mongoose = await mongoose.connect('mongodb://localhost:27017/shop', {
      useNewUrlParser:true, 
      useUnifiedTopology: true,
    });  
    app.use(admin.options.rootPath, router);
  };
  run();
  app.use('/admin', adminRouter);
require('./config/passport');

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs',exphbs({
    hbs: allowInsecurePrototypeAccess(Handlebars),
    extname: 'hbs',
    defaultLayout: 'mainLayout',
    layoutsDir: __dirname+'/views/'
}));
app.set('view engine', 'hbs');
app.listen(port,()=>{
    console.log('Server on port: 3000');
});
app.use(logger('dev'));
//var csrfProtection = csrf({ cookie: true });
app.use(bodyparser.json());
//var parseForm = bodyParser.urlencoded({ extended: false});
app.use(bodyParser.urlencoded({ extended: false}));
app.use(validator());
app.use(cookieParser());

app.use(session({
    secret: 'mysecret', 
    resave: false, 
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 }
}));
app.use(csrf());
//app.use(csrf({ cookie: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, '/public')));

app.use(function(req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    var token = req.csrfToken();
    res.locals.csrfToken = token;
    next();
});

app.use('/', orderController);

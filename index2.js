import mainRouter from './src/routes/main-router';

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const logger = require('morgan');
const bodyparser = require('body-parser');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const validator = require('express-validator');
const MongoStore = require('connect-mongo')(session);

const bodyParser = require('body-parser');
const orderController = require('./controllers/orderController');
const adminRouter = require('./src/admin');

const app = express();
const port = 3000;

process.setMaxListeners(Infinity);

const run = async () => {
  await mongoose.connect('mongodb://localhost:27017/shop');
};
run();
app.use('/admin', adminRouter);
require('./config/passport');

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs({
  hbs: allowInsecurePrototypeAccess(Handlebars),
  extname: 'hbs',
  defaultLayout: 'mainLayout',
  layoutsDir: `${__dirname}/views/`,
}));
app.set('view engine', 'hbs');
app.listen(port, () => {
  console.log('Server on port: 3000');
});
app.use(logger('dev'));
app.use(bodyparser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());

app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 180 * 60 * 1000 },
}));
app.use(csrf());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, '/public')));

app.use((req, res, next) => {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  const token = req.csrfToken();
  res.locals.csrfToken = token;
  next();
});

app.use('/', mainRouter);

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import exphbs from 'express-handlebars';
import path from 'path';
import cookieParser from 'cookie-parser';

import mainRouter from './src/routes/main-router';

(async () => {
  const app = express();

  app.engine(
    'hbs',
    exphbs({
      defaultLayout: 'mainLayout',
      layoutsDir: `${__dirname}/views/`,
      extname: '.hbs',
    })
  );
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'hbs');

  app.use(cors());
  app.use(bodyParser.json());
  app.use(cookieParser());

  // const router = new Router();
  // router.get('/', (req, res) => {
  //   res.render('home');
  // });

  app.use('/', mainRouter);

  try {
    await mongoose.connect('mongodb://localhost:27017/shop');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
})();

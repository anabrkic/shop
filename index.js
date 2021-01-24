import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import exphbs from 'express-handlebars';
import path from 'path';
import cookieParser from 'cookie-parser';
import AdminBro from 'admin-bro';
import AdminBroExpress from '@admin-bro/express';
import AdminBroMongoose from '@admin-bro/mongoose';

import mainRouter from './src/routes/main-router';

AdminBro.registerAdapter(AdminBroMongoose);

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

  let mongooseDb;
  try {
    mongooseDb = await mongoose.connect('mongodb://localhost:27017/shop', {
      useNewUrlParser: true,
    });
  } catch (err) {
    console.error(err);
  }

  const adminBro = new AdminBro({
    databases: [mongooseDb],
    rootPath: '/admin',
  });

  const router = AdminBroExpress.buildRouter(adminBro);
  app.use(adminBro.options.rootPath, router);

  app.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
  });
})();

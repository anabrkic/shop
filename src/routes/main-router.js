import { Router } from 'express';

import { handleGetUsers } from '../controllers/users-controller';
import {
  handleLogin,
  handleSignup,
  handleLogout,
} from '../controllers/auth-controller';
import { requireAuth } from '../middleware/auth-middleware';
import {
  handleAddProduct,
  handleGetProduct,
  handleGetProducts,
  handleUpdateProduct,
} from '../controllers/product-controller';

const mainRouter = new Router();

// unauthenticated routes
mainRouter.get('/', (req, res) => {
  res.render('home');
});
mainRouter.post('/login', handleLogin);
mainRouter.get('/login', (req, res) => {
  res.render('user/signin');
});
mainRouter.post('/signup', handleSignup);
mainRouter.get('/signup', (req, res) => {
  res.render('user/signup');
});

// authenticated routes
mainRouter.get('/users', requireAuth, handleGetUsers);
mainRouter.post('/logout', requireAuth, handleLogout);
mainRouter.get('/products', requireAuth, handleGetProducts);
mainRouter.get('/products/:id', requireAuth, handleGetProduct);
mainRouter.post('/products/:id', requireAuth, handleUpdateProduct);
mainRouter.post('/products', requireAuth, handleAddProduct);

export default mainRouter;

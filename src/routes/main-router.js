import { Router } from 'express';

import { handleGetUsers } from '../controllers/users-controller';
import {
  handleLogin,
  handleSignup,
  handleLogout,
} from '../controllers/auth-controller';
import { requireAuth } from '../middleware/auth-middleware';

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

export default mainRouter;

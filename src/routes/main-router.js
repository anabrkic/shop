import { Router } from 'express';

import { handleGetUsers } from '../controllers/users-controller';
import { handleLogin, handleSignup, handleLogout } from '../controllers/auth-controller';
import { requireAuth } from '../middleware/auth-middleware';

const mainRouter = new Router();
mainRouter.get('/users', handleGetUsers);
mainRouter.post('/signup', handleSignup);
mainRouter.post('/login', handleLogin);
mainRouter.post('/logout', handleLogout);
mainRouter.get('/', (req, res) => {
  res.render('home');
});
mainRouter.get('/signup', (req, res) => {
  res.render('user/signup');
});
mainRouter.get('/login', (req, res) => {
  res.render('user/signin');
});

export default mainRouter;

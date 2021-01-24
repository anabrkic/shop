import { Router } from 'express';

import {
  handleDeleteUser, handleGetUser,
  handleGetUsers, handleUpdateUser,
} from '../controllers/users-controller';
import { handleLogin, handleSignup } from '../controllers/auth-controller';
import { requireAuth } from '../middleware/auth-middleware';
import {
  handleAddProduct,
  handleDeleteProduct,
  handleGetCategoryProducts,
  handleGetFilteredProducts,
  handleGetProduct,
  handleGetProducts,
  handleUpdateProduct,
} from '../controllers/product-controller';
import {
  handleAddBuyersCart,
  // handleAddToCart,
  handleGetBuyersCart,
  handleUpdateCart,
} from '../controllers/cart-controller';
import {
  handleAddCategory,
  handleGetCategories,
} from '../controllers/category-controller';
import {
  handleCreateOrder,
  handleDeleteOrder,
  handleGetBuyerOrders,
  handleGetOrders
} from "../controllers/order-controller";

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

mainRouter.post('/categories', handleAddCategory);
mainRouter.get('/categories', handleGetCategories);

// authenticated routes
mainRouter.get('/users', requireAuth, handleGetUsers);
mainRouter.delete('/users/:id', requireAuth, handleDeleteUser);
mainRouter.put('/users/:id', handleUpdateUser);
mainRouter.get('/users/:id', handleGetUser);
mainRouter.get('/category-products', handleGetCategoryProducts);
mainRouter.get('/filtered-products', handleGetFilteredProducts);
mainRouter.get('/products', handleGetProducts);
mainRouter.get('/products/:id', handleGetProduct);
mainRouter.delete('/products/:id', handleDeleteProduct);
mainRouter.post('/products/:id', handleUpdateProduct);
mainRouter.post('/products', handleAddProduct);

mainRouter.put('/cart', handleUpdateCart);
mainRouter.get('/cart/:id', handleGetBuyersCart);
mainRouter.post('/cart', handleAddBuyersCart);

mainRouter.post('/orders', handleCreateOrder);
mainRouter.get('/orders', handleGetOrders);
mainRouter.delete('/orders/:id', handleDeleteOrder);
mainRouter.get('/buyer-orders', handleGetBuyerOrders);

export default mainRouter;

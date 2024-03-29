import { Router } from 'express';

import {
  handleDeleteUser,
  handleGetUser,
  handleGetUsers,
  handleUpdateUser,
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
  handleDeleteCategory,
  handleGetCategories,
} from '../controllers/category-controller';
import {
  handleCreateOrder,
  handleDeleteOrder,
  handleGetBuyerOrders,
  handleGetOrders, handleUpdateOrder,
} from '../controllers/order-controller';

// mainRouter je objekt na kojeg kacimo sve nase rute
// postoje get, post, put, delete kako je definirano
// u REST API
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
mainRouter.delete('/categories/:id', handleDeleteCategory);

// authenticated routes
// requireAuth rute zasticene middlewareom
mainRouter.get('/users', handleGetUsers);
// sa :id opisujemo rute kojima je potreban id kojeg onda dohvacamo
// preko params
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
mainRouter.put('/products/:id', handleUpdateProduct);

mainRouter.put('/cart', handleUpdateCart);
mainRouter.get('/cart/:id', handleGetBuyersCart);
mainRouter.post('/cart', handleAddBuyersCart);

mainRouter.post('/orders', handleCreateOrder);
mainRouter.get('/orders', handleGetOrders);
mainRouter.delete('/orders/:id', handleDeleteOrder);
mainRouter.get('/buyer-orders', handleGetBuyerOrders);
mainRouter.put('/orders/:id', handleUpdateOrder);

export default mainRouter;

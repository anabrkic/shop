const express = require('express');
const Handlebars = require('handlebars');
const mongoose = require('mongoose');
const assert = require('assert');
const csrf = require('csurf');
const paginate = require('handlebars-paginate');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
const { title } = require('process');
const products = require('../src/shop/product');
const rings = require('../src/shop/ring');
const earrings = require('../src/shop/earring');
const bracelets = require('../src/shop/bracelet');
const necklaces = require('../src/shop/necklace');
const userprofiles = require('../src/models/userprofile');

const router = express.Router();
const Cart = require('../src/models/cart');

const csrfProtection = csrf();
router.use(csrfProtection);

function isLoggedIn(req, res, next) {
  // if (req.isAuthenticated()) {
  //   return next();
  // }
  // res.redirect('/');
  console.log('req', req);
}

router.get('/user/orders', isLoggedIn, (req, res, next) => {
  res.render('user/orders');
});

router.get('/user/profilee', isLoggedIn, (req, res, next) => {
  userprofiles
    .find({ user: req.user }, (err, userprofile) => {
      if (err) {
        return res.write('Error!');
      }
      res.render('user/profilee', { profile: userprofile });
    })
    .lean();
});
router.get('/user/createprofile', isLoggedIn, (req, res, next) => {
  res.render('user/createprofile');
});
router.post('/user/createprofile', (req, res, next) => {
  Userprofile.create(
    {
      source: req.body.userprofileToken,
    },
    (err, userprofile) => {
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
        city: req.body.city,
      });
      userprofile.save((err, result) => {
        res.redirect('user/profilee');
      });
    },
  );

  res.redirect('user/profilee');
});
router.get(
  '/user/editprofile',
  isLoggedIn,
  csrfProtection,
  (req, res, next) => {
    userprofiles
      .find({ user: req.user }, (err, userprofile) => {
        if (err) {
          return res.write('Error!');
        }
        res.render('user/editprofile', {
          profile: userprofile,
          csrfToken: req.csrfToken(),
        });
      })
      .lean();
  },
);
router.post('/user/editprofile', csrfProtection, (req, res, next) => {
  userprofiles
    .find({ user: req.user }, (err, doc) => {
      if (err) {
        return res.write('Error!');
      }
      // source: req.body.userprofileToken;
      doc.firstname = req.body.firstname;
      doc.surname = req.body.surname;
      doc.phone = req.body.phone;
      doc.address = req.body.address;
      doc.city = req.body.city;
      doc.save();
    })
    .lean();

  res.redirect('user/profilee');
});

router.get('/', (req, res) => {
  res.render('home');
});
router.get('/products', (req, res, next) => {
  products.product
    .find((err, docs) => {
      const productChunks = [];
      const chunkSize = 3;
      for (let i = 0; i < docs.length; i += chunkSize) {
        productChunks.push(docs.slice(i, i + chunkSize));
      }
      res.render('products', { products: productChunks });
    })
    .lean();
});
router.get('/shop/rings', (req, res, next) => {
  rings.ring
    .find((err, docs) => {
      const ringChunks = [];
      const chunkSize = 3;
      for (let i = 0; i < docs.length; i += chunkSize) {
        ringChunks.push(docs.slice(i, i + chunkSize));
      }
      res.render('shop/rings', { rings: ringChunks });
    })
    .lean();
});

router.get('/shop/earrings', (req, res, next) => {
  earrings.earring
    .find((err, docs) => {
      const earringChunks = [];
      const chunkSize = 3;
      for (let i = 0; i < docs.length; i += chunkSize) {
        earringChunks.push(docs.slice(i, i + chunkSize));
      }
      res.render('shop/earrings', { earrings: earringChunks });
    })
    .lean();
});

router.get('/shop/bracelets', (req, res, next) => {
  bracelets.bracelet
    .find((err, docs) => {
      const braceletChunks = [];
      const chunkSize = 3;
      for (let i = 0; i < docs.length; i += chunkSize) {
        braceletChunks.push(docs.slice(i, i + chunkSize));
      }
      res.render('shop/bracelets', { bracelets: braceletChunks });
    })
    .lean();
});

router.get('/shop/necklaces', (req, res, next) => {
  necklaces.necklace
    .find((err, docs) => {
      const necklaceChunks = [];
      const chunkSize = 3;
      for (let i = 0; i < docs.length; i += chunkSize) {
        necklaceChunks.push(docs.slice(i, i + chunkSize));
      }
      res.render('shop/necklaces', { necklaces: necklaceChunks });
    })
    .lean();
});

router.get('/add-to-cart/:id', (req, res, next) => {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});
  products.product.findById(productId, (err, product) => {
    if (err) {
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/products');
  });
});
router.get('/rings/add-to-cart/:id', (req, res, next) => {
  const ringId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});
  rings.ring.findById(ringId, (err, ring) => {
    if (err) {
      return res.redirect('/');
    }
    cart.add(ring, ring.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/shop/rings');
  });
});

router.get('/earrings/add-to-cart/:id', (req, res, next) => {
  const earringId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});
  earrings.earring.findById(earringId, (err, earring) => {
    if (err) {
      return res.redirect('/');
    }
    cart.add(earring, earring.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/shop/earrings');
  });
});

router.get('/bracelets/add-to-cart/:id', (req, res, next) => {
  const braceletId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});
  bracelets.bracelet.findById(braceletId, (err, bracelet) => {
    if (err) {
      return res.redirect('/');
    }
    cart.add(bracelet, bracelet.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/shop/bracelets');
  });
});

router.get('/necklaces/add-to-cart/:id', (req, res, next) => {
  const necklaceId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});
  necklaces.necklace.findById(necklaceId, (err, necklace) => {
    if (err) {
      return res.redirect('/');
    }
    cart.add(necklace, necklace.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/shop/necklaces');
  });
});

router.get('/add/:id', (req, res, next) => {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.addByOne(productId);
  req.session.cart = cart;
  res.redirect('/cart');
});

router.get('/reduce/:id', (req, res, next) => {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/cart');
});

router.get('/remove/:id', (req, res, next) => {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/cart');
});

router.get('/cart', (req, res) => {
  if (!req.session.cart) {
    return res.render('cart', { products: null });
  }
  const cart = new Cart(req.session.cart);
  res.render('cart', {
    products: cart.generateArray(),
    totalPrice: cart.totalPrice,
  });
});

router.get('/checkout', isSignIn, (req, res) => {
  if (!req.session.cart) {
    return res.redirect('/cart');
  }
  const cart = new Cart(req.session.cart);
  res.render('checkout', { total: cart.totalPrice });
});

router.post('/checkout', isSignIn, (req, res, next) => {
  if (!req.session.cart) {
    return res.redirect('/cart');
  }
  const cart = new Cart(req.session.cart);
});

router.get('/orders', (req, res) => {
  res.render('orders');
});
router.get('/logout', isLoggedIn, (req, res, next) => {
  req.logout();
  req.session.cart = null;
  res.redirect('/');
});

router.use('/', notLoggedIn, (req, res, next) => {
  next();
});
router.get('/', (req, res) => {
  res.render('home');
});

router.get('/user/signup', notLoggedIn, (req, res, next) => {
  const messages = req.flash('error');
  res.render('user/signup', {
    csrfToken: req.csrfToken(),
    messages,
    hasErrors: messages.length > 0,
  });
});
router.post(
  '/user/signup',
  notLoggedIn,
  passport.authenticate('local.signup', {
    failureRedirect: '/user/signup',
    failureFlash: true,
  }),
  (req, res, next) => {
    if (req.session.oldUrl) {
      const { oldUrl } = req.session;
      req.session.oldUrl = null;
      res.redirect(oldUrl);
    } else {
      res.redirect('/');
    }
  },
);

router.get('/user/signin', (req, res, next) => {
  const messages = req.flash('error');
  res.render('user/signin', {
    csrfToken: req.csrfToken(),
    messages,
    hasErrors: messages.length > 0,
  });
});

router.post(
  '/user/signin',
  passport.authenticate('local.signin', {
    failureRedirect: '/user/signin',
    failureFlash: true,
  }),
  (req, res, next) => {
    if (req.session.oldUrl) {
      const { oldUrl } = req.session;
      req.session.oldUrl = null;
      res.redirect(oldUrl);
    } else {
      res.redirect('/');
    }
  },
);

router.get('/products', (req, res, next) => {
  products.product
    .find((err, docs) => {
      res.render('products', { products: docs });
    })
    .lean();
});

router.get('/product', (req, res, next) => {
  res.render('productssss');
});

router.get('/shop/rings', (req, res, next) => {
  rings.ring
    .find((err, docs) => {
      const ringChunks = [];
      const chunkSize = 3;
      for (let i = 0; i < docs.length; i += chunkSize) {
        ringChunks.push(docs.slice(i, i + chunkSize));
      }
      res.render('shop/rings', { rings: ringChunks });
    })
    .lean();
});

router.get('/shop/earrings', (req, res, next) => {
  earrings.earring
    .find((err, docs) => {
      const earringChunks = [];
      const chunkSize = 3;
      for (let i = 0; i < docs.length; i += chunkSize) {
        earringChunks.push(docs.slice(i, i + chunkSize));
      }
      res.render('shop/earrings', { earrings: earringChunks });
    })
    .lean();
});

router.get('/shop/bracelets', (req, res, next) => {
  bracelets.bracelet
    .find((err, docs) => {
      const braceletChunks = [];
      const chunkSize = 3;
      for (let i = 0; i < docs.length; i += chunkSize) {
        braceletChunks.push(docs.slice(i, i + chunkSize));
      }
      res.render('shop/bracelets', { bracelets: braceletChunks });
    })
    .lean();
});

router.get('/shop/necklaces', (req, res, next) => {
  necklaces.necklace
    .find((err, docs) => {
      const necklaceChunks = [];
      const chunkSize = 3;
      for (let i = 0; i < docs.length; i += chunkSize) {
        necklaceChunks.push(docs.slice(i, i + chunkSize));
      }
      res.render('shop/necklaces', { necklaces: necklaceChunks });
    })
    .lean();
});

router.get('/product', (req, res, next) => {
  res.render('productssss');
});

router.get('/add-to-cart/:id', (req, res, next) => {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});
  products.product.findById(productId, (err, product) => {
    if (err) {
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/products');
  });
});

router.get('/rings/add-to-cart/:id', (req, res, next) => {
  const ringId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});
  rings.ring.findById(ringId, (err, ring) => {
    if (err) {
      return res.redirect('/');
    }
    cart.add(ring, ring.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/shop/rings');
  });
});

router.get('/earrings/add-to-cart/:id', (req, res, next) => {
  const earringId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});
  earrings.earring.findById(earringId, (err, earring) => {
    if (err) {
      return res.redirect('/');
    }
    cart.add(earring, earring.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/shop/earrings');
  });
});

router.get('/bracelets/add-to-cart/:id', (req, res, next) => {
  const braceletId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});
  bracelets.bracelet.findById(braceletId, (err, bracelet) => {
    if (err) {
      return res.redirect('/');
    }
    cart.add(bracelet, bracelet.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/shop/bracelets');
  });
});

router.get('/necklaces/add-to-cart/:id', (req, res, next) => {
  const necklaceId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});
  necklaces.necklace.findById(necklaceId, (err, necklace) => {
    if (err) {
      return res.redirect('/');
    }
    cart.add(necklace, necklace.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/shop/necklaces');
  });
});

router.get('/cart', (req, res) => {
  if (!req.session.cart) {
    return res.render('cart', { products: null });
  }
  const cart = new Cart(req.session.cart);
  res.render('cart', {
    products: cart.generateArray(),
    totalPrice: cart.totalPrice,
  });
});

router.get('/checkout', isSignIn, (req, res) => {
  if (!req.session.cart) {
    return res.redirect('/cart');
  }
  const cart = new Cart(req.session.cart);
  res.render('checkout', { total: cart.totalPrice });
});

router.post('/checkout', isSignIn, (req, res, next) => {
  if (!req.session.cart) {
    return res.redirect('/cart');
  }
  const cart = new Cart(req.session.cart);
});

module.exports = router;

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

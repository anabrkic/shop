import mongoose from 'mongoose';

import { Cart, CartItem } from '../models/cart';

export async function handleUpdateCart(req) {
  const { id: productId, quantity, buyer } = req.body;

  const buyerCart = await Cart.find({ buyer });

  const updatedCartItems = buyerCart.cartItems.push([productId, quantity]);
  await Cart.updateOne(
    { _id: buyerCart._id },
    { $set: { cartItems: updatedCartItems } },
  );
}

export async function handleGetBuyersCart(req, res) {
  const { id } = req.params;
  console.log('buyer', id);
  const buyerCart = await Cart.find({ buyer: id });

  return res.send(buyerCart);
}

export async function handleAddBuyersCart(req, res) {
  const { id: productId, quantity, buyer } = req.body;

  const cartItem = await CartItem.create({
    productId: mongoose.Types.ObjectId(productId),
    quantity: parseInt(quantity),
  });

  const buyerCart = await Cart.find({ buyer });
  if (buyerCart.length === 0) {
    await Cart.create({
      buyer,
      cartItems: [cartItem],
    });
  } else {
    const cartItemsCopy = [...buyerCart[0].cartItems];
    cartItemsCopy.push(cartItem);
    await Cart.updateOne(
      { _id: buyerCart[0]._id },
      { $set: { cartItems: cartItemsCopy } },
    );
    // console.log('updatedCartItems', updatedCartItems);
  }

  return res.send(buyerCart);
}

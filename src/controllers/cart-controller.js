import { Cart } from '../models/cart';

export async function handleAddToCart(req) {
  const { id: productId, quantity, buyer } = req.body;

  const buyerCart = await Cart.find({ buyer });
  const updatedCartItems = buyerCart.cartItems.push([productId, quantity]);
  await Cart.updateOne(
    { _id: buyerCart._id },
    { $set: { cartItems: updatedCartItems } },
  );
}

export async function handleGetBuyersCart(req, res) {
  const { buyer } = req.body;
  const buyerCart = await Cart.find({ buyer });

  return res.send(buyerCart);
}

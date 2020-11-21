import mongoose from 'mongoose';

const { Schema, ObjectId } = mongoose;

const cartItem = new Schema({
  productId: [{ type: ObjectId, ref: 'Product' }],
  quantity: { type: Number, required: true },
});

const cartSchema = new Schema({
  buyer: { type: ObjectId, ref: 'User' },
  cartItems: [cartItem],
});

export const Cart = mongoose.model('Cart', cartSchema);

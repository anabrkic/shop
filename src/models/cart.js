import mongoose from 'mongoose';

const { Schema, ObjectId } = mongoose;

const cartItemSchema = new Schema({
  productId: { type: ObjectId, ref: 'Product' },
  quantity: { type: Number, required: true },
});

const cartSchema = new Schema({
  buyer: { type: ObjectId, ref: 'User' },
  cartItems: [cartItemSchema],
});

// jedina schema koja je malo drugacija jer cartItems referenciraju drugu schemu.
// Tada su cartItems array [] cartItemScheme, a unutar cartItemScheme takoder
// imamo referencu na Product
export const Cart = mongoose.model('Cart', cartSchema);
export const CartItem = mongoose.model('CartItem', cartItemSchema);

import mongoose from 'mongoose';

const { Schema, ObjectId } = mongoose;

const orderSchema = new Schema({
  buyer: { type: ObjectId, ref: 'User' },
  orderCode: { type: String },
  status: { type: String },
  date: { type: Date, default: Date.now },
  totalPrice: { type: String },
});

export const Order = mongoose.model('Order', orderSchema);

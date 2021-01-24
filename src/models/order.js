import mongoose from 'mongoose';

const { Schema, ObjectId } = mongoose;

const orderSchema = new Schema({
  buyer: { type: ObjectId, ref: 'User' },
  orderCode: { type: String },
  status: { type: String },
  date: { type: Date, default: Date.now },
  totalCost: { type: String },
  phoneNumber: { type: String },
  city: { type: String },
  postalCode: { type: String },
  address: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  items: { type: Array },
});

export const Order = mongoose.model('Order', orderSchema);

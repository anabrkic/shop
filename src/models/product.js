import mongoose from 'mongoose';

const { Schema } = mongoose;

const productSchema = new Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  imageUrl: { type: String, required: true },
  color: { type: String, required: true },
  description: { type: String, required: true },
});

export const Product = mongoose.model('Product', productSchema);

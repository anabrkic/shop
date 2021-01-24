import mongoose from 'mongoose';

const { Schema, ObjectId } = mongoose;

const productSchema = new Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  imageUrl: { type: String, required: true },
  material: { type: String, required: true },
  description: { type: String, required: true },
  categoryId: { type: ObjectId, ref: 'Category' },
});

export const Product = mongoose.model('Product', productSchema);

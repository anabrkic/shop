import mongoose from 'mongoose';

const { Schema } = mongoose;

const categorySchema = new Schema({
  name: { type: String },
});

export const Category = mongoose.model('Category', categorySchema);

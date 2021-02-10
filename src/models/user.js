import mongoose from 'mongoose';

const { Schema } = mongoose;

// kreiranje mongo scheme za korisnika
const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: Number, default: 0 },
});

// schemu koristimo za kreiranje mongo modela, 'User' je ime modela.
export const User = mongoose.model('User', userSchema);

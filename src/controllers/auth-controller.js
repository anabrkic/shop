import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { User } from '../models/user';

const MAX_TOKEN_AGE = 60 * 60 * 24;

function createToken(id) {
  return jwt.sign({ id }, 'secret', { expiresIn: MAX_TOKEN_AGE });
}

// TODO: check empty states and throw errors accordingly for all handlers
export async function handleSignup(req, res) {
  const { email, firstName, lastName, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 12);

  const isAnExistingUser = await User.findOne({ email });
  if (isAnExistingUser) {
    return res.status(500).send({ error: 'User already exists' });
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });
  await user.save();

  const token = createToken(user._id);

  return res.status(200).send({ user, token });
}

export async function handleLogin(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  const token = createToken(user._id);

  if (!user) {
    return res.status(404).send({ error: 'User not found' });
  }

  const valid = await bcrypt.compare(password, (user || []).password);
  if (!valid) {
    return res.status(500).send({ error: 'Error while logging in' });
  }
  return res.status(200).send({ user, token });
}

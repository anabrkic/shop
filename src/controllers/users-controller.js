import { User } from '../models/user';
import { Product } from '../models/product';

export async function handleGetUsers(req, res) {
  let userDetails;

  try {
    const users = await User.find().exec();
    userDetails = users.map((user) => ({
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    }));
  } catch (err) {
    return res.send(err);
  }

  return res.send(userDetails);
}

export async function handleDeleteUser(req, res) {
  const { id } = req.params;

  try {
    await User.remove({ _id: id });
  } catch (err) {
    return res.send(err);
  }

  return res.send(id);
}

export async function handleUpdateUser(req, res) {
  const { id } = req.params;

  const { email = '', firstName = '', lastName = '' } = req.body;

  await User.updateOne({ _id: id }, { $set: { email, firstName, lastName } });

  return res.send(id);
}

export async function handleGetUser(req, res) {
  const { id } = req.params;

  const user = await User.findOne({ _id: id });

  return res.send(user);
}

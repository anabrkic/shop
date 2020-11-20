import { User } from '../models/user';

export async function handleGetUsers(req, res) {
  let userEmails;

  try {
    const users = await User.find().exec();
    userEmails = users.map((user) => ({ email: user.email }));
  } catch (err) {
    return res.send(err);
  }

  return res.send(userEmails);
}

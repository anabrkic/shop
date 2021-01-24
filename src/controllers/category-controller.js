import { Category } from '../models/category';
import {User} from "../models/user";

export async function handleAddCategory(req, res) {
  const { name } = req.body;
  const category = await Category.create({
    name,
  });
  await category.save();

  return res.send(category);
}

export async function handleGetCategories(req, res) {
  const categories = await Category.find().exec();

  return res.send(categories);
}

export async function handleDeleteCategory(req, res) {
  const { id } = req.params;

  try {
    await Category.remove({ _id: id });
  } catch (err) {
    return res.send(err);
  }

  return res.send(id);
}

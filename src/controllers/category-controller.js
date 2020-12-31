import { Category } from '../models/category';

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

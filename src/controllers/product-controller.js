import { Product } from '../models/product';

export async function handleGetProducts(req, res) {
  let products = [];
  try {
    products = await Product.find().exec();
  } catch (err) {
    return res.send(err);
  }

  return res.send(products);
}

export async function handleGetProduct(req, res) {
  const { id } = req.params;

  const product = Product.findOne({ _id: id });

  if (!product) {
    return res.status(404).send({ error: 'Product not found' });
  }

  return res.send(product);
}

export async function handleUpdateProduct(req, res) {
  const { id } = req.params;
  const {
    name = '',
    price = '',
    imageUrl = '',
    color = '',
    description = '',
  } = req.body;

  await Product.updateOne(
    { _id: id },
    { $set: { name, price, imageUrl, color, description } }
  );

  return res.send(Product.findOne({ _id: id }));
}

export async function handleAddProduct(req, res) {
  const {
    name = '',
    price = '',
    imageUrl = '',
    color = '',
    description = '',
  } = req.body;
  const product = await Product.create({
    name,
    price,
    imageUrl,
    color,
    description,
  });
  await product.save();

  return res.send(product);
}

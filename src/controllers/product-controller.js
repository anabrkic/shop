import querystring from 'querystring';

import mongoose from 'mongoose';
import { Product } from '../models/product';
import {User} from "../models/user";

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

  const product = await Product.find({
    _id: mongoose.Types.ObjectId(id),
  }).exec();

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
    material = '',
    description = '',
    categoryId = '',
  } = req.body;

  await Product.updateOne(
    { _id: id },
    { $set: { name, price, imageUrl, material, description, categoryId } },
  );

  return res.send('OK');
}

export async function handleAddProduct(req, res) {
  const {
    name = '',
    price = '',
    imageUrl = '',
    material = '',
    description = '',
    categoryId = '',
  } = req.body;
  const product = await Product.create({
    name,
    price,
    imageUrl,
    material,
    description,
    categoryId,
  });
  await product.save();

  return res.send(product);
}

export async function handleGetCategoryProducts(req, res) {
  const queryString = req.url.split('?')[1];
  const queryList = querystring.parse(queryString);

  const products = await Product.find().exec();
  const categoryProducts = products.filter(
    (product) => product.categoryId.toString() === queryList.categoryId,
  );
  res.send(categoryProducts);
}

export async function handleGetFilteredProducts(req, res) {
  const queryString = req.url.split('?')[1];
  const queryList = querystring.parse(queryString);
  console.log('QUERYLIST', queryList);
  const products = await Product.find().exec();
  console.log('products', products);
  let filteredProducts;
  if (queryList.material === 'all') {
    filteredProducts = products.filter(
      (product) => product.categoryId.toString() === queryList.categoryId
    );
  } else {
    filteredProducts = products.filter(
      (product) => product.material === queryList.material
        && product.categoryId.toString() === queryList.categoryId
    );
  }
  res.send(filteredProducts);
}

export async function handleDeleteProduct(req, res) {
  const { id } = req.params;

  try {
    await Product.remove({ _id: id });
  } catch (err) {
    return res.send(err);
  }

  return res.send(id);
}

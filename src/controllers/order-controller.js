import querystring from 'querystring';
import { Product } from '../models/product';
import { Order } from '../models/order';
import { Cart } from '../models/cart';
import {User} from "../models/user";

const uuid = require('uuid');

export async function handleCreateOrder(req, res) {
  const {
    firstName = '',
    lastName = '',
    items = [],
    address = '',
    postalCode = '',
    city = '',
    phoneNumber = '',
    totalCost = '',
    buyer = '',
    status = 'PENDING',
  } = req.body;

  const orderCode = uuid.v4();

  const order = await Order.create({
    firstName,
    lastName,
    items,
    address,
    postalCode,
    city,
    phoneNumber,
    totalCost,
    buyer,
    status,
    orderCode,
  });
  await order.save();

  return res.send(order);
}

export async function handleGetBuyerOrders(req, res) {
  const queryString = req.url.split('?')[1];
  const queryList = querystring.parse(queryString);

  const orders = await Order.find({ buyer: queryList.buyerId });

  return res.send(orders);
}

export async function handleGetOrders(req, res) {
  const orders = await Order.find().exec();

  return res.send(orders);
}

export async function handleDeleteOrder(req, res) {
  const { id } = req.params;

  try {
    await Order.remove({ _id: id });
  } catch (err) {
    return res.send(err);
  }

  return res.send(id);
}

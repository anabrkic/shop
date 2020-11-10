const express = require('express');
const AdminBro = require('admin-bro');
const AdminBroExpress = require('admin-bro-expressjs');
const AdminBroMongoose = require('admin-bro-mongoose');
const options = require('./admin.options');
const buildAdminRouter = require('./admin.router');



const adminBro = new AdminBro(options);
const router = AdminBroExpress.buildRouter(adminBro);
module.exports = router
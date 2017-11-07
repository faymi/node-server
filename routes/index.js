var express = require('express');
var router = express.Router();

var getAdmin = require('./getAdmin');
var users = require('./users');

module.exports = function (app) {
  app.use('/apis', getAdmin);
}
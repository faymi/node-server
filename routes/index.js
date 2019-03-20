var express = require('express');
var router = express.Router();

var user = require('./user');

module.exports = (app) => {
  app.use('/apis', user);
}
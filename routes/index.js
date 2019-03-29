var express = require('express');
var router = express.Router();

var user = require('./user');
var user = require('./worm');

module.exports = (app) => {
  app.use('/apis', user);
  app.use('/worm', user);
}
var express = require('express');
var router = express.Router();

var user = require('./user');
var worm = require('./worm');

module.exports = (app) => {
  app.use('/apis', user);
  app.use('/worm', worm);
}
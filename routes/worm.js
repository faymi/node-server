var express = require('express');
var router = express.Router();
import Spiker from '../controller/worm/spider'

router.post('/screenShot', Spiker.screenshot);

module.exports = router;

var express = require('express');
var router = express.Router();
import Spiker from '../controller/worm/spider'

router.post('/screenShot', Spiker.screenshot);
router.post('/spideData', Spiker.spideData);

module.exports = router;

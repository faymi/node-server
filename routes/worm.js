var express = require('express');
var router = express.Router();
import Spiker from '../controller/worm/spider'

router.post('/screenShot', Spiker.screenshot);
router.get('/spideData', Spiker.spideData);
router.get('/spideManhua', Spiker.spideManhua);

module.exports = router;

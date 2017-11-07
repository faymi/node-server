var express = require('express');
var router = express.Router();
var pool = require('../mysqlDB/mysqlConfig');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/getAdmin', function(req, res, next){
   
  var  sql = 'SELECT * FROM websites';

  pool.getConnection(function(err, connection) {
  // Use the connection
  connection.query(sql, function (error, results, fields) {

  var json = JSON.stringify(results);
  res.json(JSON.parse(json));  
  // And done with the connection.
  connection.release();

  // Handle error after the release.
  if (error) throw error;

  // Don't use the connection here, it has been returned to the pool.
  });
});

  //查
  // connection.query(sql,function (err, result) {
  //         if(err){
  //           console.log('[SELECT ERROR] - ',err.message);
  //           return;
  //         }
   
  //        console.log('--------------------------SELECT----------------------------');
  //        console.log(result);
  //        console.log('------------------------------------------------------------\n\n');  
  //        var json = JSON.stringify(result);
  //        res.json(JSON.parse(json));
  // });
  
  // connection.end();
  
  // res.json({
  //   "code": 0,
  //   "data": {
  //     "name": "lzh",
  //     "gender": "male",
  //     "age": 20,
  //     "appearance": "handsome"
  //   },
  //   "msg": "success"
  // });
})
module.exports = router;

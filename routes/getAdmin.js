var express = require('express');
var router = express.Router();
import User from '../controller/user/user'

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/getAdmin', function(req, res, next){
   
  var  sql = 'SELECT * FROM websites';

  getAdminQuery(sql, res, req, next);
});

async function getAdminQuery(sql, res, req, next) {
  var connection = await poolConn();
  connection.query(sql, function (error, results, fields) {
    
    var json = JSON.stringify(results);
    res.json(JSON.parse(json));  
    // And done with the connection.
    connection.release();
  
    // Handle error after the release.
    if (error) throw error;
  
    // Don't use the connection here, it has been returned to the pool.
    });
}

router.post('/login', User.login);
// router.post('/login', function(req, res, next) {
//   var sql = 'SELECT * FROM base_user';
//   User.login(res, req, next);
//   // login(sql, res, req, next);
// });

// async function login(sql, res, req, next) {
//   await query(sql).then(results => {
//     console.log(req.body);
//     var json = JSON.stringify(results);
//     res.json(JSON.parse(json)); 
//   });
// }

module.exports = router;

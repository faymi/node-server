var mysql  = require('mysql');  
 
// var connection = mysql.createConnection({     
//   host     : 'localhost',       
//   user     : 'root',              
//   password : '123456',       
//   port: '3306',                   
//   database: 'lin_test', 
// }); 

// 创建数据库连接池
var pool  = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  port: '3306',
  database : 'lin_test'
});

module.exports = pool;


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
  database : 'test'
});

// module.exports = pool;

let query = (sql) => {
  return new Promise((resolve, reject) => {
    pool.getConnection(function(err, connection) {
      if(err) {
        console.log("建立连接失败");
        console.log(err);
      }else{
          console.log("建立连接成功");
          console.log("连接数："+ pool._allConnections.length);//
          // Use the connection

          connection.query(sql, function (error, results, fields) {
            resolve(results);
            connection.release();
          
            if (error) {
              reject(error);
              throw error;
            };
          });
      }
    });
  });
}

export default query;
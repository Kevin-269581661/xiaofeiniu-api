/*
*MySQL数据库连接池 
*/
const mysql = require('mysql');
var pool = mysql.createPool({
  host:'127.0.0.1',
  port:3306,  //数据库端口
  user:'root',
  password:'',
  database:'xiaofeiniu',
  connectionLimit:15
});
module.exports = pool;
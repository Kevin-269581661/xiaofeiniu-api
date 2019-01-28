/*
*小肥牛扫码点餐API子系统 
*/
const PORT = 8090;
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
//导入路由器
const categoryRouter = require('./routes/admin/category');
const adminRouter = require('./routes/admin/admin');


//创建HTTP应用服务器
var app = express();
app.listen(PORT,()=>{
  console.log('Server Listening '+PORT+' ...')
});

//使用中间件cors解决跨域
// app.use(cors({
//   origin:[
//     'http://127.0.0.1:5500'
//   ],
//   credentials:true
// }))
app.use(cors())
//app.use(bodyParser.urlencoded({}))//把application/x-www-form-urlencoded格式的请求主体数据解析出来放入req.body属性。
app.use(bodyParser.json());//把json格式的请求主体数据解析出来放入req.body属性。

//挂载路由器
app.use('/admin/category',categoryRouter);
app.use('/admin',adminRouter);
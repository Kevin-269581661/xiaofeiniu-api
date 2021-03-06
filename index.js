/*
*小肥牛扫码点餐API子系统 
*/
const PORT = 5050;
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
//导入路由器
const categoryRouter = require('./routes/admin/category');
const adminRouter = require('./routes/admin/admin');
const dishRouter = require('./routes/admin/dish');
const settingsRouter = require('./routes/admin/settings');
const tableRouter = require('./routes/admin/table');

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

//挂载管理员路由器
app.use('/admin/category',categoryRouter);
app.use('/admin',adminRouter);
app.use('/admin/dish',dishRouter);
app.use('/admin/settings',settingsRouter);
app.use('/admin/table',tableRouter);

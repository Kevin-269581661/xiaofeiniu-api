/**
 * 全局设置路由
 */
const express = require('express');
const pool = require('../../pool');
var router = express.Router();
module.exports = router;

/**
 * GET /admin/ settings
 * 全局信息
 * {appName:'xxx'.....}
 */
router.get('/',(req,res)=>{
  pool.query('SELECT * FROM xfn_settings LIMIT 1',(err,result)=>{//limit后接一个参数，表示只查一行
    if(err) throw err;
    res.send(result[0]);
  })
})

/**
 * PUT /admin/settings
 * 请求数据：{appName:'xxx'...}
 * 修改全局设置
 * 返回信息
 */
router.put('/',(req,res)=>{
  pool.query('UPDATE xfn_settings SET ?',req.body,(err,result)=>{
    if(err) throw err;
    res.send({code:200,msg:'settings updated success'})
  })
})
/**
 * 管理员相关路由
 */
const express = require('express');
const pool = require('../../pool');
var router = express.Router();
module.exports = router;

/**
 * API:GET /admin/login    ---某些会使用POST，登录会生成一条记录登录时间、ip的记录
 * 请求数据：{aname:'xxx',spwd:'xxx'}
 * 完成用户登录
 * 返回数据：
 * {code:200,msg:'login succ'}
 * {code:400,msg:'aname or apwd err'}
 */
router.get('/login/:aname/:apwd', (req, res) => {
  var aname = req.params.aname;
  var apwd = req.params.apwd;
  pool.query('SELECT aid FROM xfn_admin WHERE aname=? AND apwd=PASSWORD(?)',
    [aname, apwd], (err, result) => {
      if (err) throw err;
      console.log(result)
      if (result.length > 0) {
        res.send({ code: 200, msg: 'login succ' })
      } else {
        res.send({ code: 400, msg: 'aname or apwd err' })
      }
    })
})
/**
 * API:PATCH /admin/
 * 请求数据：{aname:'xxx',oldPwd:'xxx',newPwd:'xxx'}
 * 根据管理员名和密码修改管理员密码
 * 返回数据
 * {code:200,msg:'midified succ'}
 * {code:400,msg:'aname or apwd err'}
 * {code:401,msg:'apwd not modiified'}
 */
router.patch('/', (req, res) => {
  var data = req.body;
  pool.query('SELECT aid FROM xfn_admin WHERE aname=? AND apwd=PASSWORD(?)',
    [data.aname, data.oldPwd], (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        pool.query('UPDATE xfn_admin SET apwd=PASSWORD(?) WHERE aname=?',
          [data.newPwd, data.aname], (err, result) => {
            if (err) throw err;
            if (result.changedRows > 0) {
              res.send({ code: 200, msg: 'midified succ' })
            } else {
              res.send({ code: 401, msg: 'apwd not modiified' })
            }
          })
      } else {
        res.send({ code: 400, msg: 'aname or apwd err' })
      }
    })
  //首先根据aname/oldPwd查询该用户是否存在，
  //如果查到了此用户再修改密码

})
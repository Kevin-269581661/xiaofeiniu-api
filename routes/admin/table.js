/*
*桌台相关的路由 
*/
//创建路由器
const express = require('express');
const pool = require('../../pool.js');
var router = express.Router();
/*
*API：GET/admin/table
*含义：客户端获取所有的桌台信息，按编号升序排列
*返回值形式：
*[{tid:1,tname:'...',type:xxx,status:xxx},{...}]
*/
router.get('/', (req, res) => {
  pool.query('SELECT * FROM xfn_table ORDER BY tid', (err, result) => {
    if (err) throw err;
    res.send(result);
  })
});
/**
 * API:DELETE/admin/table/:tid
 * 含义：根据表示桌台编号的路由参数，删除该菜品
 * 返回值：
 * {code:200,msg:'1 category deleted'}
 * {code:400,msg:'0 category deleted'}
 */
router.delete('/:cid', (req, res) => {
  //删除菜品之前必须把该类别的菜品的类编号设置为NULL
  pool.query('UPDATE xfn_dish SET categoryId=NULL WHERE categoryId=?',
    req.params.cid, (err, result) => {
      if (err) throw err;
      //至此指定的类别已更改完毕
      pool.query('DELETE FROM xfn_category WHERE cid=?', req.params.cid, (err, result) => {
        if (err) throw err;
        //获取DELETE语句在数据库中影响的行数
        if (result.affectedRows > 0) {
          res.send({ code: 200, msg: "1 category deleted" })
        } else {
          res.send({ code: 400, msg: "0 category deleted" })
        }
      })
    })
})
/**
 * API：POST/admin/category
 * 请求参数：{cname:'...'}
 * 含义添加新的菜品类别
 * {code:200,msg:'1 category added',cid:x}
 */
router.post('/',(req,res)=>{
  var data = req.body;//行如{cname:"恐龙类"}
  //SQL语句使用了简写set后面会自动查找json内的属性并替换
  pool.query('INSERT INTO xfn_category SET ?',data,(err,result)=>{
    if(err)throw err;
    res.send({ code: 200, msg: "1 category added" })
  })
});
/**
 * API：PUT/admin/category
 * 请求参数：{cid:x,cname:'...'}
 * 含义:根据菜品的类别编号改类别
 * {code:200,msg:'1 category modified'}
 * {code:400,msg:'0 category modified,not exists'}
 * {code:401,msg:'0 category modified,no modification'}
 */
router.put('/',(req,res)=>{
  var data=req.body;//请求数据{cid:x,cname:x}
  //此处可以对接收数据进行检验
  pool.query('UPDATE xfn_category SET ? WHERE cid=?',[data,data.cid],(err,result)=>{
    if(err) throw err;
    if(result.changedRows>0){
      res.send({code:200,msg:'1 category modified'})
    }else if(result.affectedRows == 0){
      res.send({code:400,msg:'category not exists'})
    }else if(result.changedRows == 0){
      res.send({code:401,msg:'0 category modified,no modification'})
    }
    console.log(result)
  })
})
module.exports = router;

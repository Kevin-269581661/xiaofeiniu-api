/**
 * 菜品相关路由
 */
const express = require('express');
const pool = require('../../pool');
var router = express.Router();
module.exports = router;

/**
 * API GET/admin/dish
 * 获取所有菜品（按类别进行分类）
 * 返回数据：
 * [
 *  {cid:1,cname:'肉类',dishlist:[{},{}...]},
 *  {cid:1,cname:'...类',dishlist:[{},{}...]},
 *    ...
 * ]
 */
router.get('/', (req, res) => {
  //查询所有的类别
  pool.query('SELECT cid,cname FROM xfn_category', (err, result) => {
    if (err) throw err;
    var categoryList = result;
    var count = 0;//多个查询请求异步执行，必须等所有请求完成才可发送响应
    for (let c of categoryList) {//使用let声明，是因为有闭包问题
      pool.query('SELECT * FROM xfn_dish WHERE categoryId=? ORDER BY did DESC', c.cid,
        (err, result) => {
          if (err) throw err;
          c.dishList = result;
          count++;
          if (count == categoryList.length) {
            res.send(categoryList)
          }
        })
    }
  })
})

/**
 * 接收客户端上传的菜品图片，保存在服务器上，保存该图片在服务器上的随机图片名。
 * 请求方法：POST  /admin/disn/image
 */
//使用文件上传中间件目multer
const multer = require('multer');
const fs = require('fs')
var upload = multer({
  dest: 'tmp/'  //指定客户端上传文件临时储存路径
})
//定义路由，使用文件上传中间件
router.post('/image', upload.single('dishImage'), (req, res) => {
  // console.log(req.file)
  // console.log(req.body)
  //把客户端上传的文件从临时目录转移到永久的图片路径下
  var tmpFile = req.file.path;
  //从originalname: 'fetch_qrcode_rec.jpg'中截取后缀名
  var suffix = req.file.originalname.substring(req.file.originalname.lastIndexOf('.'));
  var newFile = randFileName(suffix);
  //console.log(newFile)
  //把文件转移到新目录
  fs.rename(tmpFile, 'img/dish/' + newFile, () => {
    res.send({ code: 200, msg: 'upload success', fileName: newFile })
  })
})
//随机生成一个文件名
//suffix表示要生成的文件的后缀
function randFileName(suffix) {
  var time = new Date().getTime();
  var num = Math.floor(Math.random() * (10000 - 1000) + 1000)  //生成1000到10000之间随机数
  return time + '-' + num + suffix;
}

/**
 * POST /admin/dish
 * 请求的参数：{title:'xxx',imgUrl:'xxx',price:xxx}
 * 添加一个菜品
 * 输出消息：
 * {code:200,msg:'dish added success',dishId:xxx}
 */
router.post('/', (req, res) => {
  pool.query('INSERT INTO xfn_dish SET ?',req.body,(err,result)=>{
    if(err)throw err;
    // console.log(result)
    res.send({code:200,msg:'dish added success',dishId:result.insertId})
  })
})

 /**
  * DELETE /admin/dish/:did
  * 根据一个菜品id删除该菜品
  * 输出数据：
  * {code:200,msg:'dish deleted success'}
  * {code:400,msg:'dish not exists'}
  */
router.delete('/',(req,res)=>{
  pool.query('DELETE FROM xfn_dish WHERE did=?',req.params.did,(err,result)=>{
    if(err) throw err;
    if(result.affectedRows>0){
      res.send({code:200,msg:'dish deleted success'})
    }else{
      res.send({code:400,msg:'dish not exists'})
    }
  })
})
  /**
   * PUT /admin/dish/
   * 请求参数：{did:xxx,title:'xxx',imgUrl:'xxx',price:xxx,detail:'xxx',category:xxx}
   * 根据指定的菜品编号修改该菜品
   * 输出数据：
   * {code:200,msg:'dish updated success'}
   * {code:400,msg:'dish not exists'}
   */
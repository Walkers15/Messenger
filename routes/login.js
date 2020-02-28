const express = require('express');
const db = require('../lib/db');
const router = express.Router();

router.post('/login',(req,res,next)=>{
    console.log('post');
    var post = req.body;
    console.log(post);
    if(post.id == '' || post.password == ''){
        res.send('아이디, 비밀번호를 입력하세요');
    }
    else{
        db.query(`select * from user where id=?`,[post.id],(err,result)=> {
            if (err) {
                res.end(err);
            }
            console.log(result);
            if(result[0].id === post.id && result[0].password === post.password) {
                db.query(`update user set online=1 where id=?`, [post.id], (err2, result) => {
                    if (err2) {
                        res.end(err);
                    }
                    req.session.nickname = post.id;

                    res.writeHead(302, {Location: `/rooms`});
                    res.end();
                })
            }else{
                res.send('아이디 혹은 비밀번호가 잘못되었거나 존재하지 않는 계정입니다.')
            }
        });
    }
});
module.exports = router;

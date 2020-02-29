const express = require('express');
const db = require('../lib/db');
const router = express.Router();

router.post('/login',(req,res,next)=>{
    var post = req.body;
    if(post.id == '' || post.password == ''){
        res.send('아이디, 비밀번호를 입력하세요');
    }
    else{
        db.query(`select * from user where id=?`,[post.id],(err,result)=> {
            if (err) {
                res.end(err);
            }
            if(result[0].id === post.id && result[0].password === post.password) {
                    req.session.nickname = post.id;

                    res.writeHead(302, {Location: `/rooms`});
                    res.end();
            }else{
                res.send('아이디 혹은 비밀번호가 잘못되었거나 존재하지 않는 계정입니다.')
            }
        });
    }
});
module.exports = router;

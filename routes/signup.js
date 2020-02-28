const express = require('express');
const db = require('../lib/db');
const router = express.Router();
var html = `<!DOCTYPE html>
<html>
<head>
<meta charset= "UTF-8">
    <meta name = "viewport" content="width=device-width", initial-scale = "1">
    <title>메신저</title>
    <link rel = "stylesheet" href = "css/bootstrap.css">
    </head>
    <body>
    <style type = "text/css">
.jumbotron{
  text-shadow: black 0.2em 0.2em 0.2em;
  color: white;
}
#layer{position:absolute;top:100px;left:0;width:100%;height:100%;text-align:center}
#layer .content{display:inline-block;vertical-align:middle}
#layer .blank{display:inline-block;width:0;height:100%;vertical-align:middle}
</style>
<nav class="navbar navbar-light bg-light">
    <span class="navbar-brand mb-0 h1">Messenger</span>
    </nav>
    <div id = "layer">
    <p>실제 사용하는 정보를 입력하지 마세요.<BR>이 앱은 id,pw를 서버에 해싱하지 않고 저장합니다.</p>
    <form action = '/signup/process' method="post" class = "content">
				<!--post메소드를 통해 쿼리 스트링 생성 없이 안전하게 전송-->
				<p><input type = "text" name ="id" placeholder = "id, 최대20자"></p>
				<p>
				<p><input type = "password" name ="password" placeholder = "password, 최대20자"></p>
				</p>
				<input class = "btn btn-primary" type = "submit" value="회원가입!">
				</form>
</div>
</body>
</html>`
//받은 정보로 mysql에 유저 정보 생성
router.post('/process',(req,res,next)=>{
    console.log('post');
    var post = req.body;
    if(post.id == '' || post.password == ''){
        res.send('아이디, 비밀번호를 입력하세요');
    }
    else{
        db.query(`Insert into user(id,password,friend_count,date,friend_name,reception)
        VALUES(?,?,0,NOW(),'','');`,[post.id,post.password],(err,result)=> {
            if (err) {
                res.end(err);
            }
            res.writeHead(302, {Location: `/`});
            res.end();
        });
    }
});
//정보 입력하는 곳
router.get('/', function(req, res, next) {
    res.send(html);
});


module.exports = router;

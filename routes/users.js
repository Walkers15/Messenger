var express = require('express');
var router = express.Router();
const db = require('../lib/db');
/* GET users listing. */
router.get('/:userId',(req,res,next)=>{
  var myName = req.session.nickname;
  var userId = req.params.userId;
  db.query('select * from user where id=?',[userId],(err,result)=>{
    if(err){
      res.send(err);
    }
    if(result[0].reception.includes(myName)) {
      res.send(`이미 친구신청한 사람입니다.<BR><a href='/users'>유저 목록으로 돌아가기</a>`);
    }
    else {
      result[0].reception += myName+',';
      db.query('update user set reception=? where id=?', [result[0].reception, userId], (err, result) => {
        res.send(`
    <html>
<head>
    <meta charset="utf-8">
    <title>Socket</title>
    <link rel = "stylesheet" href = "../css/bootstrap.css">

</head>
<body>
<style type = "text/css">
    .row{
        border-width : 1px;
        border-color : black;
        border-style: solid;
    }
    
</style>
<nav class="navbar navbar-light bg-light">
    <span class="navbar-brand mb-0 h1">Messenger</span>
    <ul class="nav justify-content-center">
        <li class="nav-item">
            <a class="nav-link" href="/rooms">Rooms</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="/users">Users</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="/Friends">Friends</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="/Logout">Logout</a>
        </li>
    </ul>
</nav>
<div class = "container">
    ${userId} 님께 친구 신청을 보냈습니다.
    <BR>
    <a href = '/users'>유저 목록으로 돌아가기</a>
</div>
</body>
</html>
    `)
      });
    }
  });

});
router.get('/', function(req, res, next) {
  var myName = req.session.nickname;
  db.query('select * from user order by date','',(err,result)=>{
    if(err) {
      res.send(err);
    }
    db.query('select date_format(date,\'%Y-%m-%d\') as date from user order by date','',(err,_result)=>{
      if(err){
        res.send(err);
      }
      var userList = getList(result,_result,myName);
      res.send(`
    <html>
<head>
    <meta charset="utf-8">
    <title>Socket</title>
    <link rel = "stylesheet" href = "../css/bootstrap.css">

</head>
<body>
<style type = "text/css">
    .row{
        border-width : 1px;
        border-color : black;
        border-style: solid;
    }
    
</style>
<nav class="navbar navbar-light bg-light">
    <span class="navbar-brand mb-0 h1">Messenger</span>
    <ul class="nav justify-content-center">
        <li class="nav-item">
            <a class="nav-link" href="/rooms">Rooms</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="/users">Users</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="/Friends">Friends</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="/Logout">Logout</a>
        </li>
    </ul>
</nav>
<div class = "container">
    <p>${userList}</p>
</div>
</body>
</html>
    `);
    })
  });
});
function getList(list,date,myName){
  var userList ='';
  for(let i = 0 ; i < list.length ; i++){
    if(list[i].id === myName){
      continue;
    }
    var state;
    if(list[i].online){
      state =  '온라인'
    }else{
      state =  '오프라인'
    }
    userList += `<div class="row">
    <div class="col-3">
        <div style="margin-top: 12px">아이디 : ${list[i].id}</div>
    </div>
    <div class="col-2">
        <span> 현재 상태 : <BR>${state}</span>
</div>
    <div class = "col-3">
        <span> 가입날짜 : <BR>${date[i].date}</span>
    </div>
    <div class ="col-2">
        <div style="margin-top: 12px"> 친구수 : ${list[i].friend_count}</div>
    </div>
    `;
    if(list[i].friend_name.includes(myName)){
      userList += `</div>
          <p></p>`;
    }else{
      userList += `<div class ="col">
        <a style="margin-top: 8px" href="users/${list[i].id}" class="btn btn-primary btn-sm active" role="button">친구 요청</a>
    </div>
</div>
<p></p>`
    }
  }
  return userList;
}

module.exports = router;

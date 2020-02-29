const express = require('express');
const db = require('../lib/db');
const router = express.Router();
const app = require('../app');
app.io = require('socket.io')();
router.get('/', function(req, res, next) {
    db.query('select * from rooms;','',(err,result)=> {
        if (err) {
            console.log('err');
            return err;
        }
        if(result[0].member_list.includes(req.session.nickname)){
            result[0].member_count--;
        }
        if(result[1].member_list.includes(req.session.nickname)){
            result[1].member_count--;
        }
        res.send(`<!DOCTYPE html>
<html>
<head>
<meta charset= "UTF-8">
    <meta name = "viewport" content="width=device-width", initial-scale = "1">
    <title>메신저</title>
    <link rel = "stylesheet" href = "css/bootstrap.css">
    </head>
    <body>
    <style type = "text/css">
.row{
    border-width : 1px;
    border-color : black;
    border-style: solid;
}
span{
    vertical-align: -7.5px;
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
    <p style="margin-top: 1rem">${req.session.nickname}님 환영합니다!</p>
    <div class="row">
        <div class="col" style = "vertical-align: middle;">
         <span>방 번호 : ${result[0].num}</span>
        </div>
        <div class = "col">
            <span> 참여 인원 수 : ${result[0].member_count}</span>
        </div>
        <div class ="col" style = "text-align: center">
            <a href="room/${result[0].num}" class="btn btn-primary active" role="button">입장</a>
        </div>
    </div>
    <p></p>
    <div class="row">
        <div class="col">
         <span>방 번호 : ${result[1].num}</span>
        </div>
        <div class = "col">
            <span> 참여 인원 수 : ${result[1].member_count}</span>
        </div>
        <div class ="col" style = "text-align: center">
            <a href="room/${result[1].num}" class="btn btn-primary active" role="button">입장</a>
        </div>
    </div>
    </div>
    </body>
    </html>`
        );
    });
});
router.get('/:roomId',(req,res)=>{

});
module.exports = router;

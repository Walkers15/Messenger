var express = require('express');
var router = express.Router();
const db = require('../lib/db');
router.get('/list',(req,res,next)=>{
    var myName = req.session.nickname;
    db.query('select * from user where id=?',[myName],(err,result)=>{
        if(err){
            res.send(err);
        }
        var post = result[0].friend_name.split(',');
        var dateSql = 'select date_format(date,\'%Y-%m-%d\') as date from user where ';
        var sql = 'select * from user where ';
        for(var i = 0 ; i < post.length-1 ; i++){
            sql += `id='${post[i]}' or `;
            dateSql += `id='${post[i]}' or `;
        }
        sql += `id='${post[post.length-1]}'`;
        dateSql += `id='${post[post.length-1]}'`;
        db.query(sql,' ',(err,_result)=>{
            if(err){
                res.send(err);
            }
            db.query(dateSql,' ',(err,date)=>{
                var friendList = getList(_result,date,'list');
                res.send(`<html>
                <head>
                <meta charset="utf-8">
                    <title>Socket</title>
                    <link rel = "stylesheet" href = "../css/bootstrap.css">

                    </head>
                    <body>
                    <style type = "text/css">
            #state{
            border-top: none;
            border-right: none;
            border-left: none;
                    border-bottom: #00B7FF 1px solid;
                }
                .row{
                border: 1px black solid;
                }
            </style>
                <nav class="navbar navbar-light bg-light">
                    <span class="navbar-brand mb-0 h1">Messenger</span>
                    <ul class="nav justify-content-center">
                    <li class="nav-item">
                    <a class="nav-link" href="/rooms">Rooms</a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link" href="/Users">Users</a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link" href="/Friends">Friends</a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link" href="/Logout">Logout</a>
                    </li>
                    </ul>
                    </nav>
                    <p style="padding-top: 20px"></p>
                    <div class = "container">
                    <div class="row" id = "state">
                    <div class = "col-6" style="text-align: center">
                    <a href="/Friends" style="text-decoration-line: none;">수신함</a>
                    </div>
                    <div class = "col-6" style="text-align: center">
                    <a href="/Friends/list" style="text-decoration-line: none;background-color: #9fcdff"">친구 목록</a>
                </div>
                </div>
                <p style="margin-top: 1rem"></p>
                    ${friendList}
                    </div>
                    </body>
                    </html>`)
            });
        });
    });
});
router.get('/accept/:userId',(req,res,next)=>{
    //console.log(-1);
    var userId = req.params.userId;
    var myName = req.session.nickname;
    //console.log(0);
    db.query('select * from user where id=?',[myName],(err,result)=>{
        //console.log(1);
        if(err){
            res.send(err);
        }
        var pattern = new RegExp(userId+',','gi');
        result[0].reception = result[0].reception.replace(pattern,'');
        db.query('update user set reception=? where id=?',[result[0].reception,myName],(err,_result)=>{
            //console.log(2);
            if(err){
                res.send(err);
            }
            result[0].friend_name += userId+',';
            result[0].friend_count++;
            db.query('update user set friend_name=? where id=?',[result[0].friend_name,myName],(err,__result)=>{
                //console.log(3);
                db.query('update user set friend_count=? where id=?',[result[0].friend_count,myName],(err,___result)=>{
                    //console.log(4);
                    db.query('select * from user where id=?',[userId],(err,____result)=>{
                        if(____result[0].reception.includes(myName)){
                            var pattern = new RegExp(myName+',','gi');
                            ____result[0].reception = ____result[0].reception.replace(pattern,'');
                            db.query('update user set reception=? where id=?',[____result[0].reception,userId],(err,result_5)=>{
                                //console.log(5);
                                ____result[0].friend_name += myName+',';
                                ____result[0].friend_count++;
                                db.query('update user set friend_name=? where id=?',[____result[0].friend_name,userId],(err,result_6)=>{
                                    //console.log(6);
                                    db.query('update user set friend_count=? where id=?',[____result[0].friend_count,userId],(err,result_7)=>{
                                        //console.log(7);
                                        res.send(`${userId}님과 친구가 됐습니다!<BR><a href="/friends/list">친구 목록으로 이동하기</a>`);
                                    });
                                });
                            });
                        }else{
                            ____result[0].friend_name += myName+',';
                            ____result[0].friend_count++;
                            db.query('update user set friend_name=? where id=?',[____result[0].friend_name,userId],(err,result_6)=>{
                                //console.log(8);
                                db.query('update user set friend_count=? where id=?',[____result[0].friend_count,userId],(err,result_7)=>{
                                    //console.log(9);
                                    res.send(`${userId}님과 친구가 됐습니다!<BR><a href="/friends/list">친구 목록으로 이동하기</a>`);
                                });
                            });
                        }
                    });
                });
            });
        });
    });
});
router.get('/deny/:userId',(req,res,next)=>{
    var userId = req.params.userId;
    var myName = req.session.nickname;
    db.query('select * from user where id=?',[myName],(err,result)=> {
        //console.log(1);
        if (err) {
            res.send(err);
        }
        var pattern = new RegExp(userId + ',', 'gi');
        result[0].reception = result[0].reception.replace(pattern, '');
        db.query('update user set reception=? where id=?', [result[0].reception, myName], (err, _result) => {
            res.send(`${userId}님의 친구 신청이 거절되었습니다<BR><a href="/friends">수신함으로 이동하기</a>`);
        });
    });
});
router.get('/',(req,res,next)=>{
    var myName = req.session.nickname;
    //console.log(myName);
    db.query('select * from user where id=?',[myName],(err,result)=>{
        if(err){
            res.send(err);
        }
        var post = result[0].reception.split(',');
        var dateSql = 'select date_format(date,\'%Y-%m-%d\') as date from user where ';
        var sql = 'select * from user where ';
        for(var i = 0 ; i < post.length-1 ; i++){
            sql += `id='${post[i]}' or `;
            dateSql += `id='${post[i]}' or `;
        }
        sql += `id='${post[post.length-1]}'`;
        dateSql += `id='${post[post.length-1]}'`;
        //console.log(sql);
        db.query(sql,' ',(err,_result)=>{
            if(err){
                res.send(err);
            }
            db.query(dateSql,' ',(err,date)=>{
                var postbox = getList(_result,date,'post');
                res.send(`<html>
                <head>
                <meta charset="utf-8">
                    <title>Socket</title>
                    <link rel = "stylesheet" href = "../css/bootstrap.css">

                    </head>
                    <body>
                    <style type = "text/css">
            #state{
            border-top: none;
            border-right: none;
            border-left: none;
                    border-bottom: #00B7FF 1px solid;
                }
                .row{
                border: 1px black solid;
                }
            </style>
                <nav class="navbar navbar-light bg-light">
                    <span class="navbar-brand mb-0 h1">Messenger</span>
                    <ul class="nav justify-content-center">
                    <li class="nav-item">
                    <a class="nav-link" href="/rooms">Rooms</a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link" href="/Users">Users</a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link" href="/Friends">Friends</a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link" href="/Logout">Logout</a>
                    </li>
                    </ul>
                    </nav>
                    <p style="padding-top: 20px"></p>
                    <div class = "container">
                    <div class="row" id = "state">
                    <div class = "col-6" style="text-align: center">
                    <a href="/Friends" style="text-decoration-line: none; background-color: #9fcdff">수신함</a>
                    </div>
                    <div class = "col-6" style="text-align: center">
                    <a href="/Friends/list" style="text-decoration-line: none">친구 목록</a>
                </div>
                </div>
                <p style="margin-top: 1rem"></p>
                    ${postbox}
                    </div>
                    </body>
                    </html>`)
            });
        });
    })
});
router.get('/list/delete/:userId',(req,res,next)=>{
    var userId = req.params.userId;
    var myName = req.session.nickname;
    db.query('select * from user where id=?',[myName],(err,result)=>{
        //console.log(1);
        if(err){
            res.send(err);
        }
        var pattern = new RegExp(userId+',','gi');
        result[0].friend_name = result[0].friend_name.replace(pattern,'');
        db.query('update user set friend_name=? where id=?',[result[0].friend_name,myName],(err,_result)=>{
            //console.log(2);
            if(err){
                res.send(err);
            }
            result[0].friend_count--;
                db.query('update user set friend_count=? where id=?',[result[0].friend_count,myName],(err,___result)=>{
                    //console.log(4);
                    db.query('select * from user where id=?',[userId],(err,____result)=>{
                            var pattern = new RegExp(myName+',','gi');
                            ____result[0].friend_name = ____result[0].friend_name.replace(pattern,'');
                            db.query('update user set friend_name=? where id=?',[____result[0].friend_name,userId],(err,result_5)=>{
                                //console.log(5);
                                ____result[0].friend_count--;
                                    db.query('update user set friend_count=? where id=?',[____result[0].friend_count,userId],(err,result_7)=>{
                                        //console.log(7);
                                        res.send(`${userId}님을 친구 목록에서 삭제하였습니다<BR><a href="/friends/list">친구 목록으로 이동하기</a>`);
                                    });
                                });
                            });
                    });
                });
            });
    });
function getList(list,date,flag){
    var userList ='';
    for(let i = 0 ; i < list.length ; i++) {
        var state;
        if (list[i].online === 1) {
            state = '온라인'
        } else {
            state = '오프라인'
        }
        if (flag === 'post') {
            userList += `<div class="row">
    <div class="col-2">
        <div style="margin-top: 12px">아이디 : ${list[i].id}</div>
    </div>
    <div class="col-4">
        <div style="margin-top: 12px"> 현재 상태 : ${state}</div>
</div>
    <div class = "col-4">
        <div style="margin-top: 12px"> 가입날짜 : ${date[i].date}</div>
    </div>
    <div class = "col-2" style="">
        <a style="margin-top: 3px" href="Friends/accept/${list[i].id}" class="btn btn-primary btn-sm active" role="button">수락</a>
           
        <a style="margin-top: 3px" href="Friends/deny/${list[i].id}" class="btn btn-primary btn-sm active" role="button">거절</a>
    </div>
</div>
<p></p>`
        }else{
            userList += `<div class="row">
    <div class="col-2">
        <div style="margin-top: 12px">아이디 : ${list[i].id}</div>
    </div>
    <div class="col-4">
        <div style="margin-top: 12px"> 현재 상태 : ${state}</div>
</div>
    <div class = "col-4">
        <div style="margin-top: 12px"> 가입날짜 : ${date[i].date}</div>
    </div>
    <div class = "col-2" style="">
        <a style="margin-top: 3px" href="list/delete/${list[i].id}" class="btn btn-primary btn-sm active" role="button">친구 삭제</a>
        <!--<a style="margin-top: 3px" href="DM/${list[i].id}" class="btn btn-primary btn-sm active" role="button">DM</a>-->
    </div>
</div>
<p></p>`
        }
    }
    return userList;
}
module.exports = router;
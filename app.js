var createError = require('http-errors');
const bodyParser = require('body-parser');
var express = require('express');
var path = require('path');
const session = require('express-session');
const db = require('./lib/db');
const MySQLStore = require('express-mysql-session')(session);
const sqlOption = {
    host: 'localhost',
    user: 'root',
    password: '111111',
    database: 'messenger'
};
const sessionStore = new MySQLStore(sqlOption);
//라우터설정
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const roomsRouter = require('./routes/rooms');
//const friendsRouter = require('./routes/friends');
const signupRouter = require('./routes/signup');
const loginRouter = require('./routes/login');
//const logoutRouter = require('./routes/logout');
var app = express();
// view engine setup , 기본설정
app.use(bodyParser.urlencoded({extended: false}));
app.use('/js', express.static(path.join(__dirname,  'node_modules', 'bootstrap', 'dist', 'js')));
app.use('/css', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'css')));
app.use(session({
    secret: '!@qqwqqw!@GameSpring',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {httpOnly : true}
}));
//여기부터 시작!
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/signup',signupRouter);
app.use('/rooms',roomsRouter);
app.post('/login',loginRouter);
var nickname;
var socketlist;
app.get('/room/:roomId',(req,res)=>{
    nickname = req.session.nickname;
    var id = req.params.roomId;
    db.query(`select * from rooms where num=?`,[req.params.roomId],(err,result)=>{
        if(err){
            res.send(err);
        }
        var count = result[0].member_count;
        var list = result[0].member_list;
        count++;
        list += nickname+',';
        db.query(`update rooms set member_count=? where num=?`,[count,id],(err,_result)=>{
            if(err){
                res.send(err)
            }
            db.query('update rooms set member_list=? where num=?',[list,id],(err,__result)=>{
                if(err){
                    res.send(err)
                }
                console.log(list);
                socketlist = '<ul><li>';
                socketlist += list.replace(/,/gi,"</li><li>");;
                socketlist = socketlist.slice(0,socketlist.length-4);
                socketlist += '</ui>';
                console.log(socketlist);
                res.send(`<html>
    <head>
    <meta charset="utf-8">
    <title>Socket</title>
    <link rel = "stylesheet" href = "../css/bootstrap.css">
    
    </head>
    <body>
    <style type = "text/css">
    body { font: 13px Helvetica, Arial; }
        form { background: gray; padding: 2px; position: fixed; bottom: 0; width: 100%; }
        form input { border: 0; padding: 10px; width: 100%; margin-right: .5%; margin-top: .2%}
        form button { background: rgb(130, 224, 255); border: none; padding: 10px; margin-top: .2%; position: fixed; right: 0%}
        #messages { list-style-type: none; margin: 0; padding: 0; }
        #messages li { padding: 5px 10px; }
        #messages li:nth-child(odd) { background: #eee; }
        /*.area_sub::-webkit-scrollbar { width: 5.2px; }
        .area_sub::-webkit-scrollbar-track { background-color:#5D5D5D; }
        .area_sub::-webkit-scrollbar-thumb { background: #303030; }
        .area_sub::-webkit-scrollbar-thumb:hover { background: #404040; }
        .area_sub::-webkit-scrollbar-thumb:active { background: #808080; }
        .area_sub::-webkit-scrollbar-button { display: none; }*/
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
    <div class = "container-fluid" style = "height: 80%; overflow: auto;">
    <div class = "row">
        <div class = "col-9" style="width : 60%; margin-bottom: 9px;">
            <ul id="messages"></ul>
        </div>
        <div class = "col-auto">
            <p>[접속자 명단]</p>
            <span class = "memberList">hi</span>
        </div>
    </div>
    </div>
    <div>
    <form action style ="margin-bottom: 0px">
        <input id="m" autocomplete="off" /><button class="btn btn-primary">전송</button>
        <a class="btn btn-primary" href="/rooms" role="button">나가기</a>
    </form>
    </div>
    <script src="/socket.io/socket.io.js"></script>
    <script src="https://code.jquery.com/jquery-1.11.1.js"></script>
        <script>
    $(() => {
        var socket = io({transports: ['websocket'], upgrade: false});      
        $('form').submit(() => {
            socket.emit('nickname','${req.session.nickname}');
            socket.emit('${'chatMessage_'+id}', $('#m').val());
            $('#m').val('');
            return false;
        });
        socket.on('${'chatMessage_'+id}', (msg) => {
            $('#messages').append($('<li>').text(msg));
            $('.container-fluid').scrollTop($('.container-fluid')[0].scrollHeight);
        });
        socket.on('${'memberList_'+id}',(msg)=>{
            var text = '<span class="memberList">';
            text += msg;
            text += '</span>'
            $('.memberList').replaceWith(text);
        });
    });
    
</script> 
    </body>
    </html>`);
            });
        });
    });
});
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send('error');
});
app.io = require('socket.io')();
var list = new Map();
app.io.on('connection', function(socket){
    console.log("a user connected");
     list.set(socket.id,nickname);
     console.log(list);
    db.query(`select * from rooms`,'',(err,result)=> {
        //var nick = app.request.session.nickname;
        var id;
        if (err) {
            throw err
        }
        if (result[0].member_list.includes(nickname)) {
            id = 1;
        } else {
            id = 2;
        }
        app.io.emit('chatMessage_' + id, nickname + '님이 들어오셨습니다');
        console.log(socketlist);
        app.io.emit('memberList_'+id,socketlist);
    });
    //app.io.emit('UserList',);
    socket.on('disconnect', function(){
        var id;
        nickname = list.get(socket.id);
        db.query(`select * from rooms`,'',(err,result)=>{
          if(err){
              throw err
          }
          if(result[0].member_list.includes(nickname)){
              id = 0;
          }else{
              id = 1;
          }
          //console.log(result[id].member_count);
          result[id].member_count--;
          //console.log(result[id].member_count);
          var pattern = new RegExp(nickname+',','gi');
          //console.log(pattern);
          result[id].member_list = result[id].member_list.replace(pattern,'');
            var memberList = '<ul><li>';
            memberList += result[id].member_list.replace(/,/gi,"</li><li>");;
            memberList = memberList.slice(0,memberList.length-4);
          //console.log(result[id].member_list);
          db.query('update rooms set member_count=? where num=?;',[result[id].member_count,id+1],(err,_result)=>{
              if(err){
                  console.log(err);
              }
              db.query('update rooms set member_list=? where num=?;',[result[id].member_list,id+1],(err,__result)=>{
                  if(err){
                      console.log(err);
                  }
                  //console.log(nickname);
                  list.delete(socket.id);
                  app.io.emit('memberList_'+(id+1),memberList);
                  app.io.emit('chatMessage_'+(id+1),nickname+'님이 나가셨습니다');
                  console.log(nickname + ' user disconnected');
              })
          });
        });
    });
    socket.on('nickname',(msg)=>{
        nickname = msg;
    });
    socket.on('memberList_1',(msg)=>{
       app.io.emit('memberList_1',msg);
    });
    socket.on('memberList_2',(msg)=>{
        app.io.emit('memberList_2',msg);
    });
    socket.on('chatMessage_1', function(msg){
        console.log('message_1: ' + msg);
        app.io.emit('chatMessage_1', nickname+' : '+msg);
    });
    socket.on('chatMessage_2', function(msg){
        console.log('message_2: ' + msg);
        app.io.emit('chatMessage_2', nickname+' : '+msg);
        //클라이언트에서 닉네임이랑 메세지 같이 보냄
        //서버에서 구별해서 지정
    });
});
module.exports = app;
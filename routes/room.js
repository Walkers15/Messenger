exports.room = function(req,res){
    var io = req.app.io;
        io.on('connection', function(socket){
            console.log("a user connected");
            io.emit('chatMessage', `${req.session.nickname}님이 입장하셨습니다`);
            socket.on('disconnect', function(){
                console.log('user disconnected');
            });
            socket.on('chatMessage', function(msg){
                console.log('message: ' + msg);
                io.emit('chatMessage', msg);
            });
        });
        res.send(`<html>
    <head>
    <meta charset="utf-8">
    <title>Socket</title>
    <link rel = "stylesheet" href = "../css/bootstrap.css">
    
    </head>
    <body>
    <style type = "text/css">
    </style>
    <nav class="navbar navbar-light bg-light">
    <span class="navbar-brand mb-0 h1">Messenger</span>
    <ul class="nav justify-content-center">
    <li class="nav-item">
    <a class="nav-link" href="#">Rooms</a>
    </li>
    <li class="nav-item">
    <a class="nav-link" href="#">Users</a>
    </li>
    <li class="nav-item">
    <a class="nav-link" href="#">Friends</a>
    </li>
    <li class="nav-item">
    <a class="nav-link" href="#">Logout</a>
    </li>
    </ul>
    </nav>
    <ul id="messages"></ul>
    <form action>
<input id="m" autocomplete="off" /><button>Send</button>
    </form>
    <script src="/socket.io/socket.io.js"></script>
    <script src="https://code.jquery.com/jquery-1.11.1.js"></script>
        <script>
    $(() => {
        var count = 0;
        if(socket == undefined && count == 0){
                    var socket = io({transports: ['websocket'], upgrade: false});
                    socket.emit('chatMessage','소켓');
                    count++;
        }
        console.log(socket);
        $('form').submit(() => {
            socket.emit('chatMessage', $('#m').val());
            $('#m').val('');
            return false;
        });
        socket.on('chatMessage', (msg) => {
            $('#messages').append($('<li>').text(msg));
        });
    });
</script> 
    </body>
    </html>`);
}
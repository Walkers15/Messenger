var express = require('express');
var router = express.Router();
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
    <form action = "/login" method="post" class = "content">
				<p><input type = "text" name ="id" placeholder = "id"></p>
				<p>
				<p><input type = "password" name ="password" placeholder = "password"></p>
				<input class = "btn btn-primary" type = "submit" value="로그인하기">
				</p>
				</form>
	<p><a class="btn btn-primary" href="/signup" role="button">회원가입하기</a></p>
</div>
</body>
</html>`
/* GET home page. */
router.get('/', function(req, res, next) {
    res.send(html);
});
module.exports = router;

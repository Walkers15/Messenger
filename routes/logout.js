var express = require('express');
var router = express.Router();
router.get('/', function(req, res, next) {
    req.session.destroy(function(){
        req.session;
    });
    res.redirect('/');
});
module.exports = router;
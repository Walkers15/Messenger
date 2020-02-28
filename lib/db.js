var mysql = require('mysql');
var db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '111111',
	database: 'messenger'
});
var option = {
	host: 'localhost',
	user: 'root',
	password: '111111',
	database: 'messenger'
};
db.connect();
module.exports = db;

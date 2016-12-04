var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

exports.getAll = function(tableName, callback) {
    var query = 'SELECT * FROM ??;';
	var queryData = [tableName];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(id, tableName, callback) {
    var query = 'SELECT * FROM ?? WHERE ?? = ?';
    var queryData = [tableName, tableName+'_id', id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};
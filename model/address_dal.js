var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

exports.getAll = function(callback) {
    var query = 'SELECT * FROM address;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(address_id, callback) {
    var query = 'SELECT * FROM address WHERE address_id = ?';
    var queryData = [address_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.insert = function(params, callback) {
    var query = 'INSERT INTO address (street, zip_code) VALUES (?, ?)';

    // the question marks in the sql query above will be replaced by the values of the
    // the data in queryData
    var queryData = [params.street, params.zip_code];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

}

exports.delete = function(address_id, callback) {
    var query = 'DELETE FROM address WHERE address_id = ?';
    var queryData = [address_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};
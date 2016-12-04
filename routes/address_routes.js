var express = require('express');
var router = express.Router();
var table_dal = require('../model/table_dal');
var tableName = "address";


// View All addresss
router.get('/all', function(req, res) {
    table_dal.getAll(tableName, function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('address/addressViewAll', { 'result':result });
        }
    });

});

// View the address for the given id
router.get('/', function(req, res){
    if(req.query.address_id == null) {
        res.send('address_id is null');
    }
    else {
        table_dal.getById(req.query.address_id, tableName, function(err,result) {
           if (err) {
               res.send(err);
           }
           else {
               res.render('address/addressViewById', {'result': result});
           }
        });
    }
});

module.exports = router;

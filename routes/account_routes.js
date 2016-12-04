var express = require('express');
var router = express.Router();
var table_dal = require('../model/table_dal');
var tableName = "account";


// View All accounts
router.get('/all', function(req, res) {
    table_dal.getAll(tableName, function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('account/accountViewAll', { 'result':result });
        }
    });

});

// View the account for the given id
router.get('/', function(req, res){
    if(req.query.account_id == null) {
        res.send('account_id is null');
    }
    else {
        table_dal.getById(req.query.account_id, tableName, function(err,result) {
           if (err) {
               res.send(err);
           }
           else {
               res.render('account/accountViewById', {'result': result});
           }
        });
    }
});

module.exports = router;

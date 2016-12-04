var express = require('express');
var router = express.Router();
var table_dal = require('../model/table_dal');
var tableName = "company";


// View All companys
router.get('/all', function(req, res) {
    table_dal.getAll(tableName, function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('company/companyViewAll', { 'result':result });
        }
    });

});

// View the company for the given id
router.get('/', function(req, res){
    if(req.query.company_id == null) {
        res.send('company_id is null');
    }
    else {
        table_dal.getById(req.query.company_id, tableName, function(err,result) {
           if (err) {
               res.send(err);
           }
           else {
               res.render('company/companyViewById', {'result': result});
           }
        });
    }
});

module.exports = router;

var express = require('express');
var router = express.Router();
var table_dal = require('../model/table_dal');
var tableName = "school";


// View All schools
router.get('/all', function(req, res) {
    table_dal.getAll(tableName, function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('school/schoolViewAll', { 'result':result });
        }
    });

});

// View the school for the given id
router.get('/', function(req, res){
    if(req.query.school_id == null) {
        res.send('school_id is null');
    }
    else {
        table_dal.getById(req.query.school_id, tableName, function(err,result) {
           if (err) {
               res.send(err);
           }
           else {
               res.render('school/schoolViewById', {'result': result});
           }
        });
    }
});

module.exports = router;

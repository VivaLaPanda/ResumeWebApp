var express = require('express');
var router = express.Router();
var table_dal = require('../model/table_dal');
var tableName = "resume";


// View All resumes
router.get('/all', function(req, res) {
    table_dal.getAll(tableName, function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('resume/resumeViewAll', { 'result':result });
        }
    });

});

// View the resume for the given id
router.get('/', function(req, res){
    if(req.query.resume_id == null) {
        res.send('resume_id is null');
    }
    else {
        table_dal.getById(req.query.resume_id, tableName, function(err,result) {
           if (err) {
               res.send(err);
           }
           else {
               res.render('resume/resumeViewById', {'result': result});
           }
        });
    }
});

module.exports = router;

var express = require('express');
var router = express.Router();
var account_dal = require('../model/account_dal');

// View All accounts
router.get('/all', function(req, res) {
    account_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('account/accountViewAll', { 'result':result });
        }
    });

});

// Return the add a new account form
router.get('/add', function(req, res){
    // passing all the query parameters (req.query) to the insert function instead of each individually
    account_dal.getAll(function(err,result) {
        if (err) {
            res.send(err);
        }
        else {
            res.render('account/accountAdd', {'account': result});
        }
    });
});

// Get the form to edit an account
router.get('/edit', function(req, res){
    // passing all the query parameters (req.query) to the insert function instead of each individually
    account_dal.getById(req.query.account_id, function(err,result) {
        if (err) {
            res.send(err);
        }
        else {
			console.log(result);
            res.render('account/accountUpdate', {'account': result[0]});
        }
    });
});

// View the account for the given id
router.get('/', function(req, res){
    if(req.query.account_id == null) {
        res.send('account_id is null');
    }
    else {
        account_dal.getById(req.query.account_id, function(err,result) {
           if (err) {
               res.send(err);
           }
           else {
               res.render('account/accountViewById', {'result': result});
           }
        });
    }
});

// insert a account record
router.get('/insert', function(req, res){
    // simple validation
    if(req.query.email == null) {
        res.send('Email must be provided.');
    }
    else if(req.query.first_name == null) {
        res.send('First name must be provided.');
    }
    else if(req.query.last_name == null) {
        res.send('Last name must be provided.');
    }
    else {
        // passing all the query parameters (req.query) to the insert function instead of each individually
        account_dal.insert(req.query, function(err,result) {
            if (err) {
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/account/all');
            }
        });
    }
});

router.get('/update', function(req, res) {
    account_dal.update(req.query, function(err, result){
		res.redirect(302, '/account/all');
    });
});

// Delete a account for the given account_id
router.get('/delete', function(req, res){
    if(req.query.account_id == null) {
        res.send('account_id is null');
    }
    else {
         account_dal.delete(req.query.account_id, function(err, result){
             if(err) {
                 res.send(err);
             }
             else {
                 //poor practice, but we will handle it differently once we start using Ajax
                 res.redirect(302, '/account/all');
             }
         });
    }
});

module.exports = router;

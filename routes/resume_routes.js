var express = require('express');
var router = express.Router();
var resume_dal = require('../model/resume_dal');
var account_dal = require('../model/account_dal');
var skill_dal = require('../model/skill_dal');
var company_dal = require('../model/company_dal');
var school_dal = require('../model/school_dal');


// View All resumes
router.get('/all', function(req, res) {
    resume_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('resume/resumeViewAll', { 'result':result });
        }
    });

});

// Return the add a new school form
router.get('/add', function(req, res){
    // passing all the query parameters (req.query) to the insert function instead of each individually
    account_dal.getAll(function(err,accounts) {
        if (err) {
            res.send(err);
        }
        else {
			skill_dal.getAll(function(err, skills) {
				if (err) {
					res.send(err);
				}
				else {
					company_dal.getAll(function(err, companies) {
						if (err) {
							res.send(err);
						}
						else {
							school_dal.getAll(function(err, schools) {
								if (err) {
									res.send(err);
								}
								else {
									var resultsJson = {
										'accounts': accounts,
										'skills' : skills,
										'companies' : companies,
										'schools' : schools
									};
									
									res.render('resume/resumeAdd', resultsJson);
								}
							})
						}
					})
				}
			})
			
        }
    });
});

// View the resume for the given id
router.get('/', function(req, res){
	if(req.query.resume_id == null) {
		res.send('resume_id is null');
	}
	else {
		resume_dal.getById(req.query.resume_id, function(err,result) {
			if (err) {
				res.send(err);
			}
			else {
				skills = result.map(function(element) {
					return element.skill_name;
				});
				
				skills = skills.filter(function(item, pos) {
					return skills.indexOf(item) == pos;
				});
				
				
				schools = result.map(function(element) {
					return element.school_name;
				});
				
				schools = schools.filter(function(item, pos) {
					return schools.indexOf(item) == pos;
				});
				
				
				companies = result.map(function(element) {
					return element.company_name;
				});
				
				companies - companies.filter(function(item, pos) {
					return companies.indexOf(item) == pos;
				});
				
				console.log("skills", skills);
				console.log("schools", schools);
				console.log("companies", companies);

				res.render('resume/resumeViewById', {'result' : result, 'skills': skills, 'schools' : schools, 'companies' : companies});
			}
		});
	}
});

// insert a school record
router.get('/insert', function(req, res){
    // simple validation
    if(req.query.resume_name == null) {
        res.send('Resume Name must be provided.');
    }
    else if(req.query.user_account_id == null) {
        res.send('Account must be provided.');
    }
    else if(req.query.skill_id == null) {
        res.send('Skill must be provided.');
    }
    else if(req.query.company_id == null) {
        res.send('Company must be provided.');
    }
    else if(req.query.school_id == null) {
        res.send('School must be provided.');
    }
    else {
        // passing all the query parameters (req.query) to the insert function instead of each individually
        resume_dal.insert(req.query, function(err,result) {
            if (err) {
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/resume/all');
            }
        });
    }
});

/* router.get('/edit', function(req, res){
   if(req.query.resume_id == null) {
       res.send('A resume id is required');
   }
   else if(req.query.user_account_id == null) {
       res.send('An account is required');
   }
   else {
       resume_dal.getById(req.query.resume_id, function(err, resume){
           account_dal.getAll(function(err, address) {
               res.render('resume/resumeUpdate', {resume: resume[0], address: address});
           });
       });
   }
}); */



// Return the add a new school form
router.get('/edit', function(req, res){
   if(req.query.resume_id == null) {
       res.send('A resume id is required');
   }
   
    // passing all the query parameters (req.query) to the insert function instead of each individually
	resume_dal.getById(req.query.resume_id, function(err, resume) {
		account_dal.getAll(function(err,accounts) {
			if (err) {
				res.send(err);
			}
			else {
				skill_dal.getAll(function(err, skills) {
					if (err) {
						res.send(err);
					}
					else {
						company_dal.getAll(function(err, companies) {
							if (err) {
								res.send(err);
							}
							else {
								school_dal.getAll(function(err, schools) {
									if (err) {
										res.send(err);
									}
									else {
										var resultsJson = {
											'resume' : resume,
											'accounts': accounts,
											'skills' : skills,
											'companies' : companies,
											'schools' : schools
										};
										//console.log(resultsJson);
										
										res.render('resume/resumeUpdate', resultsJson);
									}
								})
							}
						})
					}
				})
				
			}
		});
	});
});

router.get('/update', function(req, res) {
    resume_dal.update(req.query, function(err, result){
       res.redirect(302, '/resume/all');
    });
});

// Delete a school for the given school_id
router.get('/delete', function(req, res){
    if(req.query.resume_id == null) {
        res.send('resume_id is null');
    }
    else {
         resume_dal.delete(req.query.resume_id, function(err, result){
             if(err) {
                 res.send(err);
             }
             else {
                 //poor practice, but we will handle it differently once we start using Ajax
                 res.redirect(302, '/resume/all');
             }
         });
    }
});

module.exports = router;

var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

/*
 create or replace view resume_view as
 select s.*, a.street, a.zip_code from resume s
 join address a on a.address_id = s.address_id;

 */

exports.getAll = function(callback) {
    var query = 'SELECT * FROM resume_view';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(resume_id, callback) {
    var query = 
		'SELECT \
			rv.*, sk.skill_name, cmp.company_name, sch.school_name\
		FROM\
			resume_view rv\
				LEFT JOIN\
			resume_skill rsk ON rsk.resume_id = rv.resume_id\
				LEFT JOIN\
			resume_company rc ON rc.resume_id = rv.resume_id\
				LEFT JOIN\
			resume_school rsh ON rsh.resume_id = rv.resume_id\
				LEFT JOIN\
			skill sk ON sk.skill_id = rsk.skill_id\
				LEFT JOIN\
			company cmp ON cmp.company_id = rc.company_id\
				LEFT JOIN\
			school sch ON sch.school_id = rsh.school_id\
		WHERE\
			rv.resume_id = ?;'
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.insert = function(params, callback) {
    // FIRST INSERT THE COMPANY
    var query = 'INSERT INTO resume (resume_name, user_account_id) VALUES (?, ?)';

    var queryData = [params.resume_name, params.user_account_id];

    connection.query(query, queryData, function(err, result) {

        // THEN USE THE resume_id RETURNED AS insertId AND THE SELECTED skill_ids INTO resume_skill
        var resume_id = result.insertId;

        // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
        var skillQuery = 'INSERT INTO resume_skill (resume_id, skill_id) VALUES ?';

        // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
        var resumeSkillData = [];
        for(var i=0; i < params.skill_id.length; i++) {
            resumeSkillData.push([resume_id, params.skill_id[i]]);
        }

        // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
        var companyQuery = 'INSERT INTO resume_company (resume_id, company_id) VALUES ?';

        // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
        var resumeCompanyData = [];
        for(var i=0; i < params.company_id.length; i++) {
            resumeCompanyData.push([resume_id, params.company_id[i]]);
        }

        // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
        var schoolQuery = 'INSERT INTO resume_school (resume_id, school_id) VALUES ?';

        // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
        var resumeSchoolData = [];
        for(var i=0; i < params.school_id.length; i++) {
            resumeSchoolData.push([resume_id, params.school_id[i]]);
        }
		

        // NOTE THE EXTRA [] AROUND resumeSkillData
		var skill;
		var company;
		var school;
		
        connection.query(skillQuery, [resumeSkillData], function(err, skill){
			console.log(err);
			
			connection.query(companyQuery, [resumeCompanyData], function(err, company){
				console.log(err);
				
				connection.query(schoolQuery, [resumeSchoolData], function(err, school){
					console.log(err);
					
					var results = {
						"skill" : skill,
						"company" : company,
						"school" : school
					};
					
					callback(err, results);
				});
			});
        });
    });
}

var resumeSkillDeleteAll = function (resume_id, callback) {
    var query = 'DELETE FROM resume_skill WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
}

var resumeSchoolDeleteAll = function (resume_id, callback) {
    var query = 'DELETE FROM resume_school WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
}

var resumeCompanyDeleteAll = function (resume_id, callback) {
    var query = 'DELETE FROM resume_company WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
}

var resumeRelationDeleteAll = function (params, callback) {
	resumeSkillDeleteAll(params.resume_id, function(err, res1) {
		resumeSchoolDeleteAll(params.resume_id, function(err, res2) {
			resumeCompanyDeleteAll(params.resume_id, function(err, res3) {
				callback(err, {"skillResult": res1, "schoolResult" : res2, "companyResult" : res3});
			})
		})
	})
}

var resumeSkillInsert = function(resume_id, skillIDArray, callback){
    // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
    var query = 'INSERT INTO resume_skill (resume_id, skill_id) VALUES ?';

    // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
    var resumeSkillData = [];
    for(var i=0; i < skillIDArray.length; i++) {
        resumeSkillData.push([resume_id, skillIDArray[i]]);
    }
    connection.query(query, [resumeSkillData], function(err, result){
        callback(err, result);
    });
};

var resumeSchoolInsert = function(resume_id, schoolIDArray, callback){
    // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
    var query = 'INSERT INTO resume_school (resume_id, school_id) VALUES ?';

    // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
    var resumeSchoolData = [];
    for(var i=0; i < schoolIDArray.length; i++) {
        resumeSchoolData.push([resume_id, schoolIDArray[i]]);
    }
    connection.query(query, [resumeSchoolData], function(err, result){
        callback(err, result);
    });
};

var resumeCompanyInsert = function(resume_id, skillIDArray, callback){
    // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
    var query = 'INSERT INTO resume_company (resume_id, company_id) VALUES ?';

    // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
    var resumeCompanyData = [];
    for(var i=0; i < skillIDArray.length; i++) {
        resumeCompanyData.push([resume_id, skillIDArray[i]]);
    }
    connection.query(query, [resumeCompanyData], function(err, result){
        callback(err, result);
    });
};

exports.update = function(params, callback) {
    var query = 'UPDATE resume SET resume_name = ? WHERE resume_id = ?';

    var queryData = [params.resume_name, params.resume_id];

    connection.query(query, queryData, function(err, result) {
        //delete relational entries for this company
        resumeRelationDeleteAll(params.resume_id, function(err, result){
			var errs = {};
			var results = {};
			
            if(params.skill_id != null) {
                //insert resume_skill ids
                resumeSkillInsert(params.resume_id, params.skill_id, function(err, result){
                    errs.skill = err;
					results.skill = result;
                });
			}
			
            if(params.school_id != null) {
                //insert resume_skill ids
                resumeSchoolInsert(params.resume_id, params.school_id, function(err, result){
                    errs.school = err;
					results.school = result;
                });
			}
			
            if(params.company_id != null) {
                //insert resume_skill ids
                resumeCompanyInsert(params.resume_id, params.company_id, function(err, result){
                    errs.company = err;
					results.company = result;
                });
			}
			
			callback(errs, results);
        });

    });
};


exports.delete = function(resume_id, callback) {
    var query = 'DELETE FROM resume WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};
"use strict";
var Pool = require("pg").Pool;

process.on("unhandledRejection", function(e){
	console.log(e.message, e.stack);
}); //error code

module.exports = (function() {
	var config = {
		host: 	  "localhost",
		user: 	  "travel_goal_server",
		password: "password",
		database: "postgres"
	};
	
	var pool = new Pool(config);

	var checkGoogleId = function(id_token,callback) {
		pool.query(
			"SELECT id FROM identity"+
			" WHERE id_token = $1;", [id_token], function(error, result) {
				if (error) return console.error(error);
				callback(result);
			}
		);
	}

	var saveGoogleId = function(id_token,callback) {
		pool.query(
			"INSERT INTO identity" + 
			" (id_token)" +
			" VALUES ($1) RETURNING id;", [id_token], function(error, result) { 
				if (error) return console.error(error);
				callback(result);
			}
		);
	}

	var saveTravelGoal = function(location, summary, priority, identity_id, callback){
		pool.query(
			"INSERT INTO travel_goal"+
			" (location, summary, priority, identity_id)"+
			" VALUES ($1, $2, $3, $4) RETURNING id;", [location, summary, priority, identity_id], function(error,result){
				if (error) return console.error(error);
				callback(result);
			}
		);
	}

	var readTravelGoals = function(identity_id, callback){
		pool.query(
			"SELECT location, summary, priority, id FROM travel_goal"+
			" WHERE identity_id = $1;", [identity_id], function(error, result) {
				if (error) return console.error(error);
				callback(result);
			}
		);
	}

	return {
		checkGoogleId: checkGoogleId,
		saveGoogleId: saveGoogleId,
		saveTravelGoal: saveTravelGoal,
		readTravelGoals: readTravelGoals
	};

})();
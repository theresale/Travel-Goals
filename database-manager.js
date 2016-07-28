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

	var checkGoogleId = function(id_token, callback) {
		pool.query(
			"SELECT id, home_city, home_city_code FROM identity"+
			" WHERE id_token = $1;", [id_token], function(error, result) {
				if (error) return console.error(error);
				callback(result);
			}
		);
	}

	var saveGoogleId = function(id_token, home_city, callback) {
		pool.query(
			"INSERT INTO identity" + 
			" (id_token, home_city)" +
			" VALUES ($1, $2) RETURNING id;", [id_token, home_city], function(error, result) { 
				if (error) return console.error(error);
				callback(result);
			}
		);
	}

	var saveTravelGoal = function(location, summary, location_type, priority, identity_id, callback){
		console.log(identity_id);
		pool.query(
			"INSERT INTO travel_goal"+
			" (location, summary, location_type, priority, identity_id)"+
			" VALUES ($1, $2, $3, $4, $5) RETURNING id;", [location, summary, location_type, priority, identity_id], function(error,result){
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

	var updateHomeCity = function(home_city, id, callback){
		pool.query(
			"UPDATE identity"+
			" SET home_city = $1"+
			" WHERE id = $2;", [home_city, id], function(error, result){
				if (error) return console.error(error);
				callback(result);
			}
		);
	}

	return {
		checkGoogleId: checkGoogleId,
		saveGoogleId: saveGoogleId,
		saveTravelGoal: saveTravelGoal,
		readTravelGoals: readTravelGoals,
		updateHomeCity: updateHomeCity
	};

})();
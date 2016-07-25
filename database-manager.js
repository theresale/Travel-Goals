"use strict";
var Pool = require("pg").Pool;

process.on("unhandledRejection", function(e){
	console.log(e.message, e.stack);
}); //error code

module.exports = (function() {
	var config = {
		host: 	  "localhost",
		user: 	  "travel_server",
		password: "password",
		database: "postgres"
	};
	
	var pool = new Pool(config);

})();
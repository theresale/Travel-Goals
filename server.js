var fs = require('fs');
var express = require("express");
var app = express();
var databaseManager = require("./database-manager.js");

app.use(express.static("public"));
app.listen(3000,function(){
	console.log("listening on port", 3000);
});

var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

var https = require("https"); //middleware - allows you to do https

function getJSON(url, callback) { //replacement for $.getJSON
	https.get(url, (response) => {
		var body = '';
		response.on('data', function(d) {
			body += d;
		});
		response.on('end', function() {
			callback(null, JSON.parse(body));
		});
	}).on('error', function(e) { //e is a common convention for error, which is why the functino is named e
		callback(e);
	});
}

app.get("/users", function(request, response){
	databaseManager.checkGoogleId(request.query.id_token, function(result){
		return response.send(result);
	});
});

app.post("/users", function(request, response){
 	databaseManager.saveGoogleId(request.body.id_token, request.body.home_city, function(result){
 		return response.send(result);
 	});
});

app.post("/goals", function(request, response){

 	databaseManager.saveTravelGoal(request.body.location, request.body.summary, request.body.location_type, request.body.location_code, request.body.priority, request.body.identity_id, function(result){
 		return response.send(result);
 	});
});

app.get("/goals", function(request, response){
	databaseManager.readTravelGoals(request.query.identity_id, function(result){
		return response.send(result);
	});
});

app.get("/cities", function(request,response){
	var myCityIs = JSON.parse(fs.readFileSync('cities.json', 'utf8'));
	response.send(myCityIs);
});

app.get("/countries", function(request,response){
	var myCountryIs = JSON.parse(fs.readFileSync('countries.json', 'utf8'));
	response.send(myCountryIs);
});

app.put("/users", function(request, response){
	console.log(request.body);
	databaseManager.updateHomeCity(request.body.home_city, request.body.home_city_code, request.body.id, function(result){
		return response.send(result);
	});
});

/* // GET DATA INTO BETTER FORMAT
	var url = "https://iatacodes.org/api/v6/cities?api_key=430d863a-093d-44db-ab0a-bb8555f2f12c&cities";
	getJSON(url, function(error,data){
		var rez = {};
		for (var i = 0, len = data.response.length; i < len; i++) {
		  rez[data.response[i].name] = data.response[i].code;
		}
		console.log(JSON.stringify(rez, null, 2));
	});
	*/



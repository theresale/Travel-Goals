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

var http = require("http"); //middleware - allows you to do https

function getJSON(url, callback) { //replacement for $.getJSON
	http.get(url, (response) => {
		var body = '';
		response.on('data', function(d) {
			body += d;
		});
		response.on('end', function() {
			callback(null, JSON.parse(body));
		});
	}).on('error', function(e) { 
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
	databaseManager.updateHomeCity(request.body.home_city, request.body.home_city_code, request.body.id, function(result){
		return response.send(result);
	});
});

app.get("/flights", function(request, response){
	var home = request.query.home_city_code;
	var dest = request.query.location_code;
	var url = "http://partners.api.skyscanner.net/apiservices/browsedates/v1.0/US/USD/en-US/"+home+"/"+dest+"/anytime?apiKey=th111691948788352142736655493904";
	getJSON(url, function(error,data){
		response.send(data);
		
	})
});

app.delete("/goals", function(request,response){
	databaseManager.deleteGoal(request.query.id, function(result){
		return response.send(result);
	});
});

app.post("/goals", function (request, response){
	console.log(request.body.note);
	console.log(request.body.travel_goal_id);
	databaseManager.saveNote(request.body.note, request.body.travel_goal_id, function(result){
		return response.send(result);
	});
});

// databaseManager.saveLocation(request.query.latitude, request.query.longitude, date, function(locationId){
// 			for(var i = 0; i<5;i++){
// 				//console.log(data.daily.data[i]);
// 			databaseManager.saveForecast(Math.round(data.daily.data[i].apparentTemperatureMax),
// 									 Math.round(data.daily.data[i].apparentTemperatureMin),
// 									 data.daily.data[i].summary,
// 									 data.daily.data[i].precipProbability,
// 									 locationId);
// 			} 
// 		});
// 		response.send(JSON.stringify(data));
// 	});


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



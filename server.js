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

app.get("/users", function(request, response){
	databaseManager.checkGoogleId(request.query.id_token, function(result){
		return response.send(JSON.stringify(result));
	});
});

app.post("/users", function(request, response){
 	databaseManager.saveGoogleId(request.body.id_token, function(result){
 		return response.send(result);
 	});
});
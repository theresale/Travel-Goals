"use strict";

var app = angular.module('myApp', []);


app.controller('userCtrl', function($scope, $http, sendData, goalService, $rootScope) {
	$scope.onSignIn = function(googleUser){
		// var id_token = googleUser.getAuthResponse().id_token;
		var id_token = googleUser.getBasicProfile().Ka;
		$scope.name = googleUser.getBasicProfile().wc;

		$http({
			method: "GET",
			url: "/users",
			params: {id_token: id_token}
		}).then(function successCallback(data){
            if(data.data.rows.length === 0){
            	$http({
		            method: "POST",
			        url: "/users",
			        data: {id_token: id_token, home_city: "Please enter your home city."}
			    }).then(function successCallback(data) {
			    	sendData.identity_id = data.data.rows[0].id;
			    	$scope.home_city = data.data.rows[0].home_city;
			    	broadcastTravelGoalRequest();
			        alert("Thank you for joining " + $scope.name + ", you may now start creating travel goals!");
			    },
			    function errorCallback(error) {
			        console.log("error");
			    });
            }else{
            	sendData.identity_id = data.data.rows[0].id;
            	$scope.home_city = data.data.rows[0].home_city;
			    broadcastTravelGoalRequest();
            	console.log("welcome back "+$scope.name);
            }
        },
        function errorCallback(error) {
            console.log(error);
        });
	};

	var broadcastTravelGoalRequest = function (){
	    $rootScope.$broadcast('retrieveGoalsBroadcast');
	}	

	window.onSignIn = $scope.onSignIn;

	$scope.updateHomeCity = function(){
		$http({
			method: "PUT",
			url:"/users",
			data: {home_city: $scope.newHome_city, id: sendData.identity_id}
			}).then(function successCallback(data){		   
			},
		    function errorCallback(error) {
		        console.log(error);
		});
	};
});

app.controller('travelGoalsCtrl', function($scope, $rootScope, $http, sendData, iataService){
	$rootScope.$broadcast('getIataCountry');
	$rootScope.$broadcast('getIataCity');
	$scope.priority = "1";

	$scope.checkLocation = function(){
		if($scope.location_type == "city"){
			if(sendData.citiesArray[$scope.location]){
				$scope.locationResponse = ": "+sendData.citiesArray[$scope.location];
			}else{
				$scope.locationResponse = ": Please choose a valid city.";
			};
		}else if($scope.location_type == "country"){
			if(sendData.countriesArray[$scope.location]){
				$scope.locationResponse = ": "+sendData.countriesArray[$scope.location];
			}else{
				$scope.locationResponse = ": Please choose a valid country.";
			};
		}else if($scope.location_type == undefined){
			$scope.locationResponse = ": Please choose City or Country";
		}
		// console.log(sendData.countriesArray["Afghanistan"]);
		// console.log(sendData.countriesArray["Ireland"]);
		// for (var country in sendData.countriesArray) {
		// 	if (sendData.countriesArray[country] === "IRL") {
		// 		console.log(country);
		// 	}
		// }
		// console.log(sendData.citiesArray);
		// console.log(sendData.countriesArray);
		
		// if(sendData.citiesArray[$scope.location]){
		// 	// $scope.locationResponse = 
		// }else{
		// 	$scope.locationResponse = "Please choose a valid city.";
		// };
	};

	$scope.addTravelGoal = function(){
		$http({
			method:"POST",
			url:"/goals",
			data: {location: $scope.location, summary: $scope.summary, location_type: $scope.location_type, priority: $scope.priority, identity_id: sendData.identity_id}
		}).then(function successCallback(data) {
            console.log(data);
        },
        function errorCallback(error) {
            console.log(error);
        });
	};

	$scope.$on('goalsRetrievedBroadcast', function() {
        $scope.goalsArray = sendData.goalsArray;
    });
});

app.service('iataService', function($rootScope, $http, sendData){
	$rootScope.$on('getIataCity', function(){
		$http({
			method:"GET",
			url:"/cities"
		}).then(function successCallback(data) {
            sendData.citiesArray = data.data;
        },
        function errorCallback(error) {
            console.log(error);
        });
	});

	$rootScope.$on('getIataCountry', function(){
		$http({
			method:"GET",
			url:"/countries"
		}).then(function successCallback(data) {
            sendData.countriesArray = data.data;
        },
        function errorCallback(error) {
            console.log(error);
        });
	});
});

app.service('goalService', function($http, sendData, $rootScope){
	$rootScope.$on('retrieveGoalsBroadcast', function() {
        $http({
			method:"GET",
			url:"/goals",
			params: {identity_id: sendData.identity_id}
		}).then(function successCallback(data) {
       		sendData.goalsArray = data.data.rows;
       		$rootScope.$broadcast('goalsRetrievedBroadcast');
        },
        function errorCallback(error) {
            console.log(error);
        });
    });
});

app.service('sendData', function(){
    this.identity_id = 0;
    this.home_city;
    this.citiesArray;
    this.countriesArray;
});




         

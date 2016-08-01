"use strict";

var app = angular.module('myApp', []);
//angular.module('myModule', ['chart.js']);

app.controller('homeCtrl', function($scope, displayService){
	$scope.showHome = function(){
        return displayService.showHome;
    };
});

app.controller('navCtrl', function($scope, displayService){
	$scope.showNav = function(){
		return displayService.showNav;
	};
});

app.controller('userCtrl', function($scope, $http, sendData, goalService, $rootScope, displayService) {
	$scope.showSignIn = function(){
        return displayService.showSignIn;
    };
    $scope.showHomeCity = function(){
        return displayService.showHomeCity;
    };
    $scope.showSignOut = function(){
        return displayService.showSignOut;
    };

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
			    	sendData.home_city_code = data.data.rows[0].home_city_code;
			    	displayService.showSignIn = false;
			    	displayService.showHome = false;
			    	displayService.showNav = true;
			    	displayService.showGoals = true;
			    	displayService.showHomeCity = true;
			    	displayService.showSignOut = true;
			    	document.getElementById("background").style.backgroundImage = none;
			    	document.getElementById("nav").style.backgroundColor = "#173526";
		
			    	broadcastTravelGoalRequest();
			        alert("Thank you for joining " + $scope.name + ", you may now start creating travel goals!");
			    },
			    function errorCallback(error) {
			        console.log("error");
			    });
            }else{
            	sendData.identity_id = data.data.rows[0].id;
            	$scope.home_city = data.data.rows[0].home_city;
            	sendData.home_city_code = data.data.rows[0].home_city_code;
            	displayService.showSignIn = false;
            	displayService.showHome = false;
            	displayService.showNav = true;
            	displayService.showGoals = true;
            	displayService.showHomeCity = true;
            	displayService.showSignOut = true;
            	document.getElementById("background").style.backgroundImage = "none";
            	document.getElementById("nav").style.backgroundColor = "#173526";

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

	$scope.checkNewHomeCity = function(){
		$rootScope.$broadcast('getIataCity');
		if(sendData.citiesArray[$scope.newHome_city]){
			$scope.homeCityResponse = "/ "+sendData.citiesArray[$scope.newHome_city];
		}else{
			$scope.homeCityResponse = "/ Please choose a valid city.";
		};
	}

	$scope.updateHomeCity = function(){
		$http({
			method: "PUT",
			url:"/users",
			data: {id: sendData.identity_id, home_city: $scope.newHome_city, home_city_code: sendData.citiesArray[$scope.newHome_city]}
			}).then(function successCallback(data){		   
			},
		    function errorCallback(error) {
		        console.log(error);
		});
	};
});

app.controller('travelGoalsCtrl', function($scope, $rootScope, $http, sendData, iataService, displayService){
	$scope.showGoals = function(){
        return displayService.showGoals;
    };

    $scope.showFlights = function(){
        return displayService.showFlights;
    };

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
		};
		// FROM 3 CHARACTER CODE TO LOCATION NAME -->
			// for (var country in sendData.countriesArray) {
			// 	if (sendData.countriesArray[country] === "IRL") {
			// 		console.log(country);
			// 	}
			// }
	};

	$scope.addTravelGoal = function(){
		if ($scope.location_type == "city"){
			var code = sendData.citiesArray[$scope.location];
		}else if($scope.location_type == "country"){
			var code = sendData.countriesArray[$scope.location];
		};

		$http({
			method:"POST",
			url:"/goals",
			data: {location: $scope.location, summary: $scope.summary, location_type: $scope.location_type, location_code: code, priority: $scope.priority, identity_id: sendData.identity_id}
		}).then(function successCallback(data) {
			window.location.reload();
            console.log(data);
        },
        function errorCallback(error) {
            console.log(error);
        });
	};

	$scope.$on('goalsRetrievedBroadcast', function() {
        $scope.goalsArray = sendData.goalsArray;
    });

    $scope.flightTest = function(location_code){
    	$http({
    		method:"GET",
    		url: "/flights",
    		params: {home_city_code: sendData.home_city_code, location_code: location_code}
    	}).then(function successCallback(data){
    		$scope.priceByMonthArray = data.data.Dates.OutboundDates;
    		displayService.showFlights = true;
    		//console.log($scope.priceByMonthArray);
    		console.log(data);
    	},
    	function errorCallback(error){
    	});
    };

    $scope.deleteGoal = function(id){
    	$http({
    		method:"DELETE",
    		url: "/goals",
    		params: {id: id}
    	}).then(function successCallback(data){
    		console.log(data);
    	},
    	function errorCallback(error){
    	});
    };
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

app.filter('dateFilter', function() {
	return function(date) {
		var d = new Date(date);
			console.log(d);

			var month = new Array();
			month[0] = "Jan";
			month[1] = "Feb";
			month[2] = "Mar";
			month[3] = "Apr";
			month[4] = "May";
			month[5] = "Jun";
			month[6] = "Jul";
			month[7] = "Aug";
			month[8] = "Sept";
			month[9] = "Oct";
			month[10] = "Nov";
			month[11] = "Dec";
			var n = month[d.getMonth()];
		return n+", "+d.getFullYear();
	};
});

app.service('sendData', function(){
    this.identity_id = 0;
    this.home_city;
    this.home_city_code;
    this.citiesArray;
    this.countriesArray;
});

app.service('displayService', function(){
	this.showHome = true;
	this.showSignIn = true;
	this.showGoals = false;
	this.showHomeCity = false;
	this.showSignOut = false;
	this.showFlights = false;
	this.showNav = false;
    
});



         

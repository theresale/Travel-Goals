"use strict";

var app = angular.module('myApp', []);


app.controller('loginCtrl', function($scope, $http, sendData) {
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
			        data: {id_token: id_token}
			    }).then(function successCallback(data) {
			    	sendData.identity_id = data.data.rows[0].id;
			        alert("Thank you for joining " + $scope.name + ", you may now start creating travel goals!");
			    },
			    function errorCallback(error) {
			        console.log("error");
			    });
            }else{
			    sendData.identity_id = data.data.rows[0].id;
            	console.log("welcome back "+$scope.name);
            }
        },
        function errorCallback(error) {
            console.log(error);
        });
	};
	window.onSignIn = $scope.onSignIn;
});

app.controller('travelGoalsCtrl', function($scope, $http, sendData){
	$scope.viewTravelGoals = function(){
		$http({
			method:"GET",
			url:"/goals",
			params: {identity_id: sendData.identity_id}
		}).then(function successCallback(data) {
            console.log(data);
        },
        function errorCallback(error) {
            console.log(error);
        });
	};

	$scope.addTravelGoal = function(){
		$http({
			method:"POST",
			url:"/goals",
			data: {location: $scope.location, summary: $scope.summary, priority: $scope.priority, identity_id: sendData.identity_id}
		}).then(function successCallback(data) {
            //console.log(data);
        },
        function errorCallback(error) {
            console.log(error);
        });
	};
});

app.service('sendData', function(){
    this.identity_id = 0;
});



         

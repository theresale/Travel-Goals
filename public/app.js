"use strict";

var app = angular.module('myApp', []);


app.controller('loginCtrl', function($scope, $http) {

	$scope.onSignIn = function(googleUser){
		// var id_token = googleUser.getAuthResponse().id_token;
		var id_token = googleUser.getBasicProfile().Ka;

		$http({
			method: "GET",
			url: "/users",
			params: {id_token: id_token}
		}).then(function successCallback(data){
            if(data.data.rows.length === 0){
            	console.log(id_token);
            	$http({
		            method: "POST",
			        url: "/users",
			        data: {id_token: id_token}
			    }).then(function successCallback(data) {
			    	var id = data.data.rows[0].id;
			        alert("Thank you for joining, you may now start creating travel goals!");
			    },
			    function errorCallback(error) {
			        console.log("error")
			    });
            }else{
            	var id = data.data.rows[0].id;
            	console.log(data);
            	console.log("welcome back");
            }
        },
        function errorCallback(error) {
            console.log(error);
        });
	};
	window.onSignIn = $scope.onSignIn;
});



         

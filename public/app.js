"use strict";

var app = angular.module('myApp', []);


app.controller('loginCtrl', function($scope, $http) {

	$scope.onSignIn = function(googleUser){
		var id_token = googleUser.getAuthResponse().id_token;
		var profile = googleUser.getBasicProfile();
		console.log(id_token);
		console.log(profile);
		// window.onLoadCallback = function(){
	 //   		gapi.load('auth2', function() {
	 //     		gapi.auth2.init();
	 //    	});
		//     if (auth2.isSignedIn.get()) {
		//   		var profile = auth2.currentUser.get().getBasicProfile();
		// 		  console.log('ID: ' + profile.getId());
		// 		  console.log('Full Name: ' + profile.getName());
		// 		  console.log('Given Name: ' + profile.getGivenName());
		// 		  console.log('Family Name: ' + profile.getFamilyName());
		// 		  console.log('Image URL: ' + profile.getImageUrl());
		// 		  console.log('Email: ' + profile.getEmail());
		// 	};
		// };
	};
	window.onSignIn = $scope.onSignIn;
});



         

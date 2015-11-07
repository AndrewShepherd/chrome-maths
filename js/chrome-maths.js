var windowPathname = window.location.pathname;

var baseText = "<base href='" + windowPathname + "' />";
var baseElement = angular.element(baseText);
angular.element('head').append(baseElement);


var app = angular.module("chromeMathsApp", ["ngRoute"]);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider.when('/gcd', { templateUrl: 'templates/gcd.html'})
		.otherwise({ templateUrl: 'templates/main.html'});
	$locationProvider.html5Mode(true);
}]);


var controller = app.controller("mainController", ["$scope", function($scope) {
	$scope.ApplicationTitle = "Chrome Maths";
}]);
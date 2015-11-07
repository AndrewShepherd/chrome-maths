var windowPathname = window.location.pathname;

var baseText = "<base href='" + windowPathname + "' />";
var baseElement = angular.element(baseText);
angular.element('head').append(baseElement);


var app = angular.module("chromeMathsApp", []);

var controller = app.controller("mainController", ["$scope", function($scope) {
	$scope.ApplicationTitle = "Chrome Maths";
}]);
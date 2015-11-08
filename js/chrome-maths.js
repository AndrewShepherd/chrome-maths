var windowPathname = window.location.pathname;

var baseText = "<base href='" + windowPathname + "' />";
var baseElement = angular.element(baseText);
angular.element('head').append(baseElement);

var app = angular.module("chromeMathsApp", ["ngRoute"]);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
	$routeProvider.when('/gcd',
		{
			templateUrl: 'templates/gcd.html',
			controller: 'gcdController'
		})
		.otherwise({ templateUrl: 'templates/main.html' });
	$locationProvider.html5Mode(true);
}]);

var controller = app.controller("mainController", ["$scope", function ($scope) {
	$scope.ApplicationTitle = "Chrome Maths";
}]);

function gcd(n1, n2) {
	if (n2 > n1) {
		var temp = n1;
		n1 = n2;
		n2 = temp;
	}
	if (n2 === 0) {
		return n1;
	} else if (n2 === 1) {
		return 1;
	} else {
		return gcd(n2, n1 % n2);
	}
}

app.controller('gcdController', ['$scope', function ($scope) {
	$scope.n1 = 0;
	$scope.n2 = 0;
	$scope.isResultVisible = false;
	$scope.resultText = "";
	$scope.calculate = function () {
		var result = gcd($scope.n1, $scope.n2);
		$scope.resultText = 'gcd(' + $scope.n1 + ', ' + $scope.n2 + ') = ' + result;
		$scope.isResultVisible = true;
	};
}]);
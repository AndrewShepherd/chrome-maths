var windowPathname = window.location.pathname;

var baseText = "<base href='" + windowPathname + "' />";
var baseElement = angular.element(baseText);
angular.element('head').append(baseElement);

var app = angular.module("chromeMathsApp", ["ngRoute"]);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
	$routeProvider.when('/gcd',
		{
			templateUrl: 'templates/gcd.html',
			controller: 'gcdController',
			matches: function (path) {
				return path === 'gcd';
			}
		})
		.when('/eulerTotient',
			{
				templateUrl: 'templates/eulerTotient.html',
				matches: function (path) {
					return path === 'eulerTotient';
				}
			})
		.otherwise({
			templateUrl: 'templates/main.html',
			matches: function () {
				return false;
			}
		});
	$locationProvider.html5Mode(true);
}]);

app.factory("routePersister", ["$rootScope", function ($rootScope) {
	return {
		watch: function () {
			$rootScope.$on("$routeChangeStart", function (event, next, current) {
				//do your validations here
				var routeToStore = undefined;
				if (next.$$route) {
					console.log("$rootScope.$on('$routeChangeStart') next.$$route.originalPath = " + next.$$route.originalPath);
					routeToStore = next.$$route.originalPath;
				} else {
					console.log("$rootScope.$on('$routeChangeStart') next.$$route is undefined");
				}
				chrome.storage.sync.set({ 'route': routeToStore });
			});
		},
		getStartingRoute: function (callback) {
			chrome.storage.sync.get('route', function (o) {
				if (o.route) {
					callback(o.route);
				} else {
					callback();
				}
			});
		}
	};
}]);

app.run(["$location", "$route", "routePersister", function ($location, $route, routePersister) {
	console.log("Inside app.run()");
	routePersister.getStartingRoute(function (r) {
		if (r) {
			$location.path(r);
		}
	});
	$route.reload();
	routePersister.watch();
}]);

var controller = app.controller("mainController", ["$scope", "$rootScope", function ($scope, $rootScope) {
	$scope.ApplicationTitle = "Chrome Maths";
}]);

app.controller('navPanelController', ["$scope", "$route", function ($scope, $route) {
	$scope.$route = $route;
}]);

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
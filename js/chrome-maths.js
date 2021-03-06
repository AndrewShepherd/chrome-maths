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
				controller: 'eulerTotientController',
				matches: function (path) {
					return path === 'eulerTotient';
				}
			})
		.when('/chineseRemainder',
			{
				templateUrl: 'templates/chineseRemainder.html',
				controller: 'chineseRemainderController',
				matches: function (path) {
					return path === 'chineseRemainder';
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
				var routeToStore = "";
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
	$scope.steps = [];

	chrome.storage.sync.get('gcdController', function (o) {
		if (o.gcdController) {
			console.log('gcdController - reading from persistent storage');
			$scope.n1 = o.gcdController.n1;
			$scope.n2 = o.gcdController.n2;
		};
	});

	$scope.calculate = function () {
		if ($scope.n1 && $scope.n2) {
			$scope.steps = [];
			var result = gcd($scope.n1, $scope.n2, function (s) { $scope.steps.push(s); });
			$scope.resultText = 'gcd(' + $scope.n1 + ', ' + $scope.n2 + ') = ' + result;
			$scope.isResultVisible = true;
			chrome.storage.sync.set({ 'gcdController': { n1: $scope.n1, n2: $scope.n2 } });
		}
	};
}]);

app.controller('eulerTotientController', ['$scope', function ($scope) {
	$scope.n = 0;
	$scope.isResultVisible = false;

	chrome.storage.sync.get('eulerTotientController', function (o) {
		var values = o['eulerTotientController'];
		if (values) {
			$scope.n = values.n;
		}
	});

	$scope.calculate = function () {
		$scope.steps = [];
		$scope.resultText = 'euler totient of ' + $scope.n + ' = ' + eulerTotient($scope.n, function (s) { $scope.steps.push(s); });
		$scope.isResultVisible = true;
		chrome.storage.sync.set({ 'eulerTotientController': { n: $scope.n } });
	};
}]);

app.controller('chineseRemainderController', ['$scope', '$timeout', function ($scope, $timeout) {
	$scope.templateTitle = 'Chinese Remainder';

	$scope.persistState = function () {
		chrome.storage.sync.set({ 'chineseRemainderController': { pairs: $scope.pairs } });
	};

	var generateId = (function () {
		var seed = 1;
		return function () {
			return 'crc_' + (++seed);
		};
	})();
	$scope.pairs = [];
	chrome.storage.sync.get('chineseRemainderController', function (o) {
		var values = o['chineseRemainderController'];
		if (values) {
			$scope.pairs = values.pairs || [];
			$scope.pairs.forEach(function (pair) {
				pair.mId = generateId();
			});
		}

	});
	$scope.addPair = function () {
		var id = generateId();
		$scope.pairs.push({
			mId: id,
			m: 0,
			c: 1
		});
		$timeout(function () {
			$(document.getElementById(id)).select().focus();
		});
		$scope.persistState();
	}
	$scope.remove = function (pair) {
		console.log("Remove pair");
		var index = $scope.pairs.indexOf(pair);
		$scope.pairs.splice(index, 1);
		$scope.persistState();
	}

	$scope.steps = [];
	$scope.result = '';
	$scope.calculate = function () {
		$scope.steps = [];
		var resultPair = chineseRemainder($scope.pairs, function (s) { $scope.steps.push(s); });
		$scope.result = 'x = ' + resultPair.c + '( MOD  ' + resultPair.m + ')';
	};
}]);
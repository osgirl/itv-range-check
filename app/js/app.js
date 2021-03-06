'use strict';

var DEBUG = false;
var ADMIN = false;

// Declare app level module which depends on filters, and services
angular.module('myApp', [
    'ngRoute',
    'myApp.filters',
    'myApp.services',
    'myApp.directives',
    'myApp.controllers',
    'autocomplete',
])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
        $routeProvider.when('/admin', {templateUrl: 'partials/admin.html', controller: 'AdminJsonCtrl'});
        $routeProvider.otherwise({redirectTo: '/'});
    }]);



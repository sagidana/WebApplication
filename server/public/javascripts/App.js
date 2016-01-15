/**
 * Created by Administrator on 08/01/2016.
 */
'use strict';

// Declare app level module which depends on views, and components
var module = angular.module('MessagesApp', ['ngRoute','checklist-model', 'MessagesApp.List', 'MessagesApp.Edit', 'MessagesApp.Create', 'MessagesApp.Item', 'ServicesModule']);

module.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);

module.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    otherwise({redirectTo: '/'});
}]);

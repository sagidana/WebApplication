/**
 * Created by Administrator on 08/01/2016.
 */
'use strict';

// Declare app level module which depends on views, and components
var module = angular.module('MessagesApp', ['ngRoute']);

module.factory('ioFactory', function ($rootScope) {
    var client = io.connect('http://localhost:8080');
    return {
        on: function (eventName, callback) {
            client.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(client, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            client.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(client, args);
                    }
                });
            })
        }
    };
});

module.config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/List'});
}]);


'use strict';

var module = angular.module('MessagesApp.Create', ['ngRoute', 'ServicesModule']);

module.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/create', {
        templateUrl: '/Views/Create.html',
        controller: 'CreateCtrl'
    })
}]);

module.controller('CreateCtrl', function ($scope, $routeParams, ioFactory) {

    ioFactory.emit('askScreens', '', function (result) { });

    ioFactory.on('getScreens', function (result) {
        if (result) {
            //console.log(result);
            $scope.Screens = result;
        }
    });

    ioFactory.emit('askTemplates', '', function (result) { });

    ioFactory.on('getTemplates', function (result) {
        if (result) {
            $scope.Templates = result;
        }
    });

    $scope.addMessage = function(Message){
        console.log(Message);
    };
});


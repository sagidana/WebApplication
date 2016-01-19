'use strict';

var module = angular.module('MessagesApp.Item', ['ngRoute', 'ServicesModule']);

module.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/item/:name', {
        templateUrl: '/Views/Item.html',
        controller: 'ItemCtrl'
    })
}]);

module.controller('ItemCtrl', function ($scope, $routeParams, ioFactory) {

    var messageName = getParameterByName('name');

    ioFactory.emit('askMessage', messageName, function (result) { });
    ioFactory.on('getMessage',function(result){
        if (result) {
            $scope.Message = result;
        }
    });

    ioFactory.on('getStatus', function (status) {
        if (status.ok){

        }
    });

    $scope.deleteMessage = function(message){
        ioFactory.emit('deleteMessage', message, function (result) { });
    }
});
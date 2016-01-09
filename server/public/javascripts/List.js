'use strict';

var module = angular.module('MessagesApp.List', ['ngRoute','ServicesModule']);

module.controller('ListCtrl', function($scope, ioFactory) {
    ioFactory.emit('askMessages','', function(result){});
    ioFactory.on('getMessages',function(result){
        if (result) {
            $scope.Messages = result;
        }
    });
});
'use strict';

var module = angular.module('MessagesApp.Edit', ['ngRoute','MessagesApp']);

module.controller('EditCtrl', function($scope, ioFactory) {
    ioFactory.emit('askMessages','1', function(result){});
    ioFactory.on('getMessages',function(result){
        if (result) {
            $scope.Messages = result;
        }
    });
});
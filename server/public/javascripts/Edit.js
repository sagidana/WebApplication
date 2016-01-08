'use strict';

var module = angular.module('MessagesApp.Edit', ['ngRoute','MessagesApp']);

module.controller('EditCtrl', function($scope, ioFactory) {
    ioFactory.emit('askMessage','1', function(result){});
    ioFactory.on('getMessage',function(result){
        if (result) {
            $scope.Messages = result;
        }
    });
});
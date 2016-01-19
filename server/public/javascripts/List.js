'use strict';

var module = angular.module('MessagesApp.List', ['ngRoute','ServicesModule']);

module.controller('ListCtrl', function($scope, ioFactory) {
    ioFactory.emit('askMessages', '', function (result) { });

    ioFactory.on('getMessages', function (result) {
        if (result) {
            $scope.Messages = result;
        }
    });

    ioFactory.on('getStatus', function (status) {
        if (status.ok)
            ioFactory.emit('askMessages', '', function (result) { });
    });

    $scope.deleteMessage = function(message){
        ioFactory.emit('deleteMessage', message, function (result) { });
    }
});

module.filter("Day", function () {
    return function (data) {
        if (data.val) {
            switch (data.index) {
                case 0:
                    return "sunday";
                case 1:
                    return "monday";
                case 2:
                    return "tuesday";
                case 3:
                    return "wednesday";
                case 4:
                    return "thursday";
                case 5:
                    return "friday";
                case 6:
                    return "saturday";
            }
        }
        return "";
    }
});
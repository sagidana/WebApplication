'use strict';

var module = angular.module('MessagesApp.Statistics', ['ngRoute','ServicesModule']);

module.controller('StatisticsCtrl', function($scope, ioFactory) {



    ioFactory.emit('askLogs', '', function (result) { });

    ioFactory.on('getLogs', function (result) {
        if (result) {
            $scope.Logs = result;
        }
    });


});
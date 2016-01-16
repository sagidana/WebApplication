/**
 * Created by Administrator on 1/16/2016.
 */
'use strict';

var module = angular.module('MessagesApp.ScreensManagement', ['ngRoute','ServicesModule']);

module.controller('ScreensManagementCtrl', function($scope, ioFactory) {

    ioFactory.emit('askScreens', '', function (result) { });
    ioFactory.on('getScreens', function (result) {
        if (result) {
            $scope.Screens = result;
        }
    });

    ioFactory.emit('askMessages', '', function (result) { });
    ioFactory.on('getMessages', function (result) {
        if (result) {
            $scope.Messages = result;
        }
    });
});

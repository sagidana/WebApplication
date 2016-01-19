/**
 * Created by Administrator on 1/16/2016.
 */
'use strict';

var module = angular.module('MessagesApp.ScreensManagement', ['ngRoute','ServicesModule']);

module.controller('ScreensManagementCtrl', function($scope, ioFactory) {

    $scope.daysName = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];

    $scope.ShowButtonDis = false;
    $scope.StopButtonDis = true;

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


    $scope.Stop = function(){
        _Stop = true;
        $scope.ShowButtonDis = false;
        $scope.StopButtonDis = true;
    };

    $scope.ShowScreen = function(Display){
        //console.log(Display);

        $scope.ShowButtonDis = true;
        $scope.StopButtonDis = false;

        ioFactory.emit('getdata', Display.screen, function (result) { });
        ioFactory.on('displayData', function (data) {
            if (data) {
                //console.log(data);
                $scope.Messages = data;
                _ScreenId = Display.screen;

                _DisplayContainer = "#display";
                _Messages = data;

                _Date = Display.date;
                _Time = Display.time;
                _Day = Display.day;

                _simulate = true;

                if (!_ON){
                    _ON = true;
                    cycle = 1;
                    _Stop = false;
                    StartCycle();
                }
            }
        });

    };
});

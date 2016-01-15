'use strict';

var module = angular.module('MessagesApp.Edit', ['ngRoute', 'ServicesModule']);

module.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/edit/:name', {
        templateUrl:'/Views/Edit.html',
        controller: 'EditCtrl'
    })
}]);

module.controller('EditCtrl',function($scope, $routeParams, ioFactory) {

    var messageName = getParameterByName('name');
    ioFactory.emit('askMessage',messageName, function(result){});
    ioFactory.on('getMessage',function(result){
        if (result) {
            $scope.Message = result;
            $scope.s_TimeFrames = [];

            for (var index = 0; index < result.TimeFrame.length; index++)
            {
                $scope.s_TimeFrames[index] = {};
                $scope.s_TimeFrames[index].FromDate = new Date(result.TimeFrame[index].FromDate);
                $scope.s_TimeFrames[index].ToDate = new Date(result.TimeFrame[index].ToDate);
                $scope.s_TimeFrames[index].FromTime = new Date(result.TimeFrame[index].FromTime);
                $scope.s_TimeFrames[index].ToTime = new Date(result.TimeFrame[index].ToTime);
            }
        }
    });

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

    //{
    //    "FromDate": new Date("1.1.2015"),
    //    "ToDate": new Date("12.31.2016"),
    //    "days": [true, true, true, true, true, true, true],
    //    "FromTime": new Date("Thu, 01 Jan 1970 01:00"),
    //    "ToTime": new Date("Thu, 01 Jan 1970 23:59")
    //}
});
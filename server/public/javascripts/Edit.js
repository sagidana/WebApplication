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
            for (var index = 0; index < result.TimeFrame.length; index++)
            {
                $scope.Message.TimeFrame[index].FromDate = new Date(result.TimeFrame[index].FromDate);
                $scope.Message.TimeFrame[index].ToDate = new Date(result.TimeFrame[index].ToDate);
                $scope.Message.TimeFrame[index].FromTime = new Date(result.TimeFrame[index].FromTime);
                $scope.Message.TimeFrame[index].ToTime = new Date(result.TimeFrame[index].ToTime);
            }

            $scope.removeTimeFrame = function(index){
                $scope.Message.TimeFrame.splice(index,1);
            };

            $scope.addTimeFrame = function(){
                $scope.Message.TimeFrame.splice($scope.Message.TimeFrame.length,0,{});
            };

            $scope.saveChanges = function(){
                $scope.Message.TimeFrame = angular.toJson($scope.Message.TimeFrame);
                $scope.Message.TimeFrame = JSON.parse($scope.Message.TimeFrame);

                for (var index = 0; index < $scope.Message.TimeFrame.length; index++)
                {
                    $scope.Message.TimeFrame[index].FromDate = new Date($scope.Message.TimeFrame[index].FromDate);
                    $scope.Message.TimeFrame[index].ToDate = new Date($scope.Message.TimeFrame[index].ToDate);
                    $scope.Message.TimeFrame[index].FromTime = new Date($scope.Message.TimeFrame[index].FromTime);
                    $scope.Message.TimeFrame[index].ToTime = new Date($scope.Message.TimeFrame[index].ToTime);
                }

                ioFactory.emit('editMessage', $scope.Message, function(result){})
                ioFactory.on('getStatus',function(result){
                    $scope.Status = result;
                });
            };
        }
    });

    ioFactory.emit('askScreens', '', function (result) { });

    ioFactory.on('getScreens', function (result) {
        if (result) {
            $scope.Screens = result;
        }
    });

    ioFactory.emit('askTemplates', '', function (result) { });

    ioFactory.on('getTemplates', function (result) {
        if (result) {
            $scope.Templates = result;
        }
    });
});
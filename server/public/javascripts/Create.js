'use strict';

var module = angular.module('MessagesApp.Create', ['ngRoute', 'ServicesModule']);

module.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/create', {
        templateUrl: '/Views/Create.html',
        controller: 'CreateCtrl'
    })
}]);

module.controller('CreateCtrl', function ($scope, $routeParams, ioFactory) {

    $scope.daysName = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];

    $scope.cleanMessage = {
        "name": "",
        "text": [""],
        "images": [""],
        "template": "",
        "dispTimeSec": 0,
        "TimeFrame": [
            {
                "FromDate": new Date(),
                "ToDate": new Date(),
                "days": [false, false, false, false, false, false, false],
                "FromTime": new Date(1000,1,1,1,0,0),
                "ToTime": new Date(1000,1,1,23,59,0)
            }
        ],
        "screen": []
    };

    $scope.Message = $scope.cleanMessage;
    $scope.uploadImage = function(){

        $scope.imageSelected = function(image) {
            if (image && image.length) {
                console.log(image);
                $scope.imageToUpload = image[0];
            }

            Upload.upload({
                    url: '/upload',
                    file: $scope.imageToUpload
                })
                .success(function(data) {
                    console.log(data, 'uploaded');
                });

        };
    };

    $scope.removeTimeFrame = function(index){
        if ($scope.Message.TimeFrame.length > 1)
            $scope.Message.TimeFrame.splice(index,1);
    };

    $scope.uploadImage = function(){
        console.log($scope.imageToUpload);
    };

    $scope.updateImages = function(){
        ioFactory.emit('askImages', '', function (result) { });
    };

    $scope.addTimeFrame = function(){
        if ($scope.Message.TimeFrame)
            $scope.Message.TimeFrame.splice($scope.Message.TimeFrame.length,0,{
                "FromDate": new Date(),
                "ToDate": new Date(),
                "days": [false, false, false, false, false, false, false],
                "FromTime": new Date(1000,1,1,1,0,0),
                "ToTime": new Date(1000,1,1,23,59,0)
            });
        else {
            $scope.Message.TimeFrame = [];
            $scope.Message.TimeFrame.splice($scope.Message.TimeFrame.length,0,{
                "FromDate": new Date(),
                "ToDate": new Date(),
                "days": [false, false, false, false, false, false, false],
                "FromTime": new Date(1000,1,1,1,0,0),
                "ToTime": new Date(1000,1,1,23,59,0)
            });
        }
        //console.log($scope.Message.TimeFrame);
    };

    ioFactory.emit('askScreens', '', function (result) { });
    ioFactory.on('getScreens', function (result) {
        if (result) {
            $scope.Screens = result;
        }
    });

    ioFactory.emit('askImages', '', function (result) { });
    ioFactory.on('getImages', function (result) {
        if (result) {
            $scope.Images = result;
        }
    });

    ioFactory.emit('askTemplates', '', function (result) { });
    ioFactory.on('getTemplates', function (result) {
        if (result) {
            $scope.Templates = result;
            $scope.Message.template = $scope.Templates[0].path;
        }
    });

    $scope.validation = function(){

        var screenValid = true;
        var TFValid = false;

        if ($scope.Message.screen.length != 0)
            screenValid = false;
        else
            screenValid = true;

        for(var index=0; index<$scope.Message.TimeFrame.length; index++){
            if (  $scope.Message.TimeFrame[index].days.indexOf(true) != -1 )
                TFValid = TFValid || false;
            else
                TFValid = TFValid || true;
        }

        return TFValid || screenValid;
    };

    $scope.addMessage = function(){
        clean($scope.Message.text,undefined);
        clean($scope.Message.images,undefined);

        $scope.Message.dispTimeSec = $scope.Message.dispTimeSec;

        for (var timef in $scope.Message.TimeFrame) {
            timef = angular.toJson(timef);
            timef = JSON.parse(timef);
        }

        ioFactory.emit('addMessage', $scope.Message, function(result){})
        ioFactory.on('getStatus',function(status){
            if (status.result.ok) {
                $('#messageAdded').modal('show');

            }
            $scope.Message = $scope.cleanMessage; // not working
            $scope.Status = status;
        });

    };
});

var clean = function(arr,deleteValue) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == deleteValue) {
            arr.splice(i, 1);
            i--;
        }
    }
    return arr;
};
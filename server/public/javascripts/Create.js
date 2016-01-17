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

    $scope.Message = {
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
            $scope.Message.TimeFrame.splice($scope.Message.TimeFrame.length,0,{});
        else {
            $scope.Message.TimeFrame = [];
            $scope.Message.TimeFrame.splice($scope.Message.TimeFrame.length,0,{});
        }
    };

    $scope.addMessage = function(){
        delete $scope.Message.$$hashKey;
        $scope.Message.TimeFrame = angular.toJson($scope.Message.TimeFrame);
        $scope.Message.TimeFrame = JSON.parse($scope.Message.TimeFrame);

        $scope.Message.TimeFrame = angular.copy($scope.Message.TimeFrame);

        for (var index = 0; index < $scope.Message.TimeFrame.length; index++)
        {
            $scope.Message.TimeFrame[index].FromDate = new Date($scope.Message.TimeFrame[index].FromDate);
            $scope.Message.TimeFrame[index].ToDate = new Date($scope.Message.TimeFrame[index].ToDate);
            $scope.Message.TimeFrame[index].FromTime = new Date($scope.Message.TimeFrame[index].FromTime);
            $scope.Message.TimeFrame[index].ToTime = new Date($scope.Message.TimeFrame[index].ToTime);
        }

        ioFactory.emit('addMessage', $scope.Message, function(result){});
        ioFactory.on('getStatus',function(status){
            if (status.ok)
                $('#messageAdded').modal('show');
        });
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
        }
    });

    $scope.addMessage = function(Message){
        clean($scope.Message.text,undefined);
        clean($scope.Message.images,undefined);

        $scope.Message.dispTimeSec = $scope.Message.dispTimeSec * 1000;

        for (var timef in $scope.Message.TimeFrame) {
            timef = angular.toJson(timef);
            timef = JSON.parse(timef);
        }
        //console.log(JSON.stringify($scope.Message));
        //console.log($scope.Message);

        ioFactory.emit('addMessage', $scope.Message, function(result){})
        ioFactory.on('getStatus',function(result){
            //console.log(result);
            $scope.Status = result;
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
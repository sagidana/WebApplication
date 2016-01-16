'use strict';

var module = angular.module('MessagesApp.Create', ['ngRoute', 'ServicesModule']);

module.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/create', {
        templateUrl: '/Views/Create.html',
        controller: 'CreateCtrl'
    })
}]);

module.controller('CreateCtrl', function ($scope, $routeParams, ioFactory) {

    /*
    $scope.Message = {
        "name": "",
        "text": [],
        "images": [],
        "template": "",
        "dispTimeSec": "",
        "TimeFrame": [
            {
                "FromDate": Date(),
                "ToDate": new Date(),
                "days": [],
                "FromTime": new Date(),
                "ToTime": new Date()
            }
        ],
        "screen": []
    };
*/
    $scope.daysName = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];

    $scope.Message = { TimeFrame: [ { days:[false,false,false,false,false,false,false] } ], screen:[], text:[] , images:[] };

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

    $scope.addMessage = function(Message){
        clean($scope.Message.text,undefined);
        clean($scope.Message.images,undefined);

        $scope.Message.dispTimeSec = $scope.Message.dispTimeSec * 1000;

        for (var timef in $scope.Message.TimeFrame) {
            timef = angular.toJson(timef);
            timef = JSON.parse(timef);
        }
        //console.log(JSON.stringify($scope.Message));
        console.log($scope.Message);

        ioFactory.emit('addMessage', $scope.Message, function(result){})
        ioFactory.on('getStatus',function(result){
            alert(result);
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
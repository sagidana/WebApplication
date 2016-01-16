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
     ['sunday','monday','tuesday','wednesday','thursday','friday','saturday']
*/
    $scope.days =[
        {name:'sunday',val:false},
        {name:'monday',val:false},
        {name:'tuesday',val:false},
        {name:'wednesday',val:false},
        {name:'thursday',val:false},
        {name:'friday',val:false},
        {name:'saturday',val:false}
    ];

    $scope.Message = { "TimeFrame": [ {days:[false,false,false,false,false,false,false]} ] };

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
        console.log($scope.Message);
        console.log($scope.days);
    };
});


'use strict';

var module = angular.module('MessagesApp.Edit', ['ngRoute', 'ServicesModule']);

module.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/Edit/:name', {
        templateUrl:'/Views/Edit.html',
        controller: 'EditCtrl'
    })
}]);

module.controller('EditCtrl', ['$scope','$routeParams', 'ioFactory',function($scope, $routeParams, ioFactory) {

    console.log($routeParams);
    ioFactory.emit('askMessage','', function(result){});
    ioFactory.on('getMessage',function(result){
        if (result) {
            $scope.Message = result;
        }
    });
}]);
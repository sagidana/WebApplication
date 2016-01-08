'use strict';

angular.module('messageApp.list', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/list', {
        templateUrl: 'Views/List.html',
        controller: 'ListCtrl'
    });
}])

.controller('ListCtrl', ['$scope', function($scope) {

}]);
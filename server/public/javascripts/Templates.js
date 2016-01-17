'use strict';

var module = angular.module('MessagesApp.Templates', ['ngRoute', 'ServicesModule']);

module.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/Templates', {
        templateUrl:'/Views/Templates.html',
        controller: 'TemplatesCtrl'
    })
}]);

module.controller('TemplatesCtrl',function($scope, $routeParams, ioFactory) {

    ioFactory.emit('askTemplates', '', function (result) { });
    ioFactory.on('getTemplates', function (result) {
        if (result) {
            $scope.Templates = result;
        }
    });

    $scope.isEditMode = false;
    $scope.isShowMode = false;

    $scope.currentTemplate = "";

    $scope.showTemplate = function(template){
        $scope.isShowMode = true;
        $scope.currentTemplate = template;
        $("#templateHtml").load(template.path);
    };
    $scope.editTemplate = function(){
        $scope.isEditMode = !$scope.isEditMode;
    };
    $scope.cancelShow = function(){
        $scope.isShowMode = true;
        $scope.isEditMode = !$scope.isEditMode;
    };


    $scope.newTemplate = function(){

    };

    $scope.saveTemplate = function(){

    };

    $scope.deleteTemplate = function(temp){

    };


});
'use strict';

var module = angular.module('MessagesApp.Templates', ['ngRoute', 'ngFileUpload', 'ServicesModule']);

module.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/Templates', {
        templateUrl:'/Views/Templates.html',
        controller: 'TemplatesCtrl'
    })
}]);

module.controller('TemplatesCtrl',function($scope, $routeParams, Upload, ioFactory) {

    ioFactory.emit('askTemplates', '', function (result) { });
    ioFactory.on('getTemplates', function (result) {
        if (result) {
            $scope.Templates = result;
        }
    });

    ioFactory.on('getStatus', function (status) {
        if (status.ok){
            ioFactory.emit('askTemplates', '', function (result) { });
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

    $scope.deleteTemplate = function(template){
        ioFactory.emit('deleteTemplate', template, function (result) { });
    };

    //watch for image file upload
    $scope.$watch('files', function() {
        $scope.upload($scope.files);
    });

    $scope.upload = function(files) {
        //console.log(files);

        if (files && files.length) {
            var file = files[0];
            //console.log(file);

            Upload.upload({
                url: '/uploadTemplate',
                file: file
            }).progress(function(evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' +
                    evt.config.file.name);
            }).success(function(data, status, headers, config) {

                $scope.Template = data;
                if ($scope.Template.uploadError) {
                    $scope.user.uploadError = $scope.Template.uploadError;
                    console.log('error on hand');
                } else {
                    //console.log(data);
                    ioFactory.emit('saveTemplate', data, function (result) {});

                    ioFactory.on('getStatus', function (status) {

                        if (status.result.ok) {
                            $('#chanegsSaved').modal('show');
                            ioFactory.emit('askTemplates', '', function (result) { });
                            ioFactory.on('getTemplates', function (result) {
                                if (result) {
                                    $scope.Templates = result;
                                }
                            });
                        }
                    });

                }
            });
        };
    };
});
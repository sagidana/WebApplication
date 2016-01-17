'use strict';

var module = angular.module('MessagesApp.Edit', ['ngRoute', 'ngFileUpload', 'ServicesModule']);

module.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/edit/:name', {
        templateUrl:'/Views/Edit.html',
        controller: 'EditCtrl'
    })
}]);

module.controller('EditCtrl',function($scope, $routeParams, Upload, ioFactory) {

    var messageName = getParameterByName('name');

    //watch for image file upload
    $scope.$watch('files', function() {
        $scope.upload($scope.files);
    });

    ////////////////////////


    $scope.uploadPic = function(file) {
        file.upload = Upload.upload({
            url: '/upload',
            data: {file: file},
        });

        file.upload.then(function (response) {
            $timeout(function () {
                file.result = response.data;
            });
        }, function (response) {
            if (response.status > 0) {
                //$scope.errorMsg = response.status + ': ' + response.data;
                console.log(response.status + ': ' + response.data);
            }
        }, function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
    };


    /////////////////////

    $scope.upload = function(files) {
        console.log(files);

        if (files && files.length) {
            var file = files[0];

            //Upload.rename(file, 'preview1.jpg');

            console.log(file);
           // file = Upload.rename(file, 'text.jpg');
            /*
             var $file = $files[i];
             Upload.upload({
             url: 'my/upload/url',
             data: {file: $file}

              */

            Upload.upload({
                url: '/upload',
                //data: {file: file}
                file: file
                //file: {key:file, name:'test.jpg'}


            }).progress(function(evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' +
                    evt.config.file.name);
            }).success(function(data, status, headers, config) {
                $scope.image = data;
                if ($scope.image.uploadError) {
                    $scope.user.uploadError = $scope.image.uploadError;
                    console.log('error on hand');
                } else {
                    ioFactory.emit('askImages', '', function (result) { });
                }
            });


        }
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

            $scope.uploadImage = function(){
                console.log($scope.imageToUpload);
            };

            $scope.updateImages = function(){
                ioFactory.emit('askImages', '', function (result) { });
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
                ioFactory.on('getStatus',function(status){
                    if (status.ok)
                        $('#chanegsSaved').modal('show');
                });
            };
        }
    });

    ioFactory.emit('askImages', '', function (result) { });
    ioFactory.on('getImages', function (result) {
        if (result) {
            $scope.Images = result;
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
'use strict';

var module = angular.module('MessagesApp.Screens', ['ngRoute', 'ServicesModule']);

module.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/Screens', {
        templateUrl:'/Views/Screens.html',
        controller: 'ScreensCtrl'
    })
}]);

module.controller('ScreensCtrl',function($scope, $routeParams, ioFactory) {

    ioFactory.emit('askScreens', '', function (result) { });
    ioFactory.on('getScreens', function (result) {
        if (result) {
            $scope.Screens = result;
            $scope.Initialize();
        }
    });

    $scope.newScreen = function(){
        $("#newScreen").modal('show');
    };

    $scope.editScreen = function(editScreen){
        $scope.editScreenData = editScreen;
        $("#editScreen").modal('show');
    };

    $scope.deleteScreen = function(deleteScreen){
        $scope.deleteScreenData = deleteScreen;
        $("#deleteScreen").modal('show');
    };

    $scope.saveDeleteScreen = function(deleteScreen){
        ioFactory.emit('deleteScreen',deleteScreen ,function (result){});
        ioFactory.on('getStatus',function(status){
            if (status.ok)
                $('#chanegsSaved').modal('show');
        });

        ioFactory.emit('askScreens', '', function (result) { });
        ioFactory.on('getScreens', function (result) {
            if (result) {
                $scope.Screens = result;
                $scope.Initialize();
            }
        });
    };

    $scope.saveEditScreen = function(editScreen){

        ioFactory.emit('editScreen',editScreen ,function (result){});
        ioFactory.on('getStatus',function(status){
            if (status.ok)
                $('#chanegsSaved').modal('show');
        });

        ioFactory.emit('askScreens', '', function (result) { });
        ioFactory.on('getScreens', function (result) {
            if (result) {
                $scope.Screens = result;
                $scope.Initialize();
            }
        });
    };

    $scope.saveNewScreen = function(location){

        ioFactory.emit('addScreen',location ,function (result){});
        ioFactory.on('getStatus',function(status){
            if (status.ok)
                $('#chanegsSaved').modal('show');
        });

        ioFactory.emit('askScreens', '', function (result) { });
        ioFactory.on('getScreens', function (result) {
            if (result) {
                $scope.Screens = result;
                $scope.Initialize();
            }
        });

    };


    // ############### google maps:
    // Init the map
    $scope.Initialize = function() {
        var geocoder = new google.maps.Geocoder();

        // new Gmaps api UI
        google.maps.visualRefresh = true;

        // set the center of the map, zoom and type
        var mapOptions = {
            zoom: 7,
            center: { lat: 31.8226331, lng: 35.2092486 },  // almost center - Jerusalem
            mapTypeId: google.maps.MapTypeId.G_NORMAL_MAP
        };

        // select div.id = "map_canvas" and make it a google map
        var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

        for(var index in $scope.Screens) {
            //console.log($scope.Screens[index]);
            geocodeAddress(geocoder, map, $scope.Screens[index]);
        }

    };

    // add new address marker to the map (Geocoder,map,address)
    // will be use by the Init func
    function geocodeAddress(geocoder, resultsMap, address) {
        geocoder.geocode({ 'address': address.location }, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                //console.log("results[0].geometry.location: " + results[0].geometry.location); // Debug

                // new marker (map,pos=add.location)
                var marker = new google.maps.Marker({
                    map: resultsMap,
                    position: results[0].geometry.location
                });

                // set marker image to be blue
                marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png')

                // show info on_pin_click
                var infowindow = new google.maps.InfoWindow({ content: "<div class='infoDiv'><h2>"+address.number + ". " + address.location + "</h2></div>" });
                google.maps.event.addListener(marker, 'click', function () {
                    infowindow.open(resultsMap, marker);
                });
            } // Else = address not found --> just skip
            else{
                //console.log('address not found');
            }

        }); // end of geocoder.geocode
    }; // end of geocodeAddress

    // ###############
});
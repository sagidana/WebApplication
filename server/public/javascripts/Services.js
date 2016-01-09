/**
 * Created by Administrator on 09/01/2016.
 */

// Declare app level module which depends on views, and components
var module = angular.module('ServicesModule', []);

module.factory('ioFactory', function ($rootScope) {
    var client = io.connect('http://localhost:8080');
    return {
        on: function (eventName, callback) {
            client.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(client, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            client.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(client, args);
                    }
                });
            })
        }
    };
});

'use strict';

var module = angular.module('MessagesApp.Statistics', ['ngRoute','ServicesModule','ng-fusioncharts']);

module.controller('StatisticsCtrl', function($scope, ioFactory) {

    $scope.ScreensStatisticsChartOptions = {
        "caption": "Number of messages displayed",
        "plotgradientcolor": "",
        "bgcolor": "FFFFFF",
        "showalternatehgridcolor": "0",
        "divlinecolor": "CCCCCC",
        "showvalues": "0",
        "showcanvasborder": "0",
        "canvasborderalpha": "0",
        "canvasbordercolor": "CCCCCC",
        "canvasborderthickness": "1",
        "captionpadding": "30",
        "linethickness": "3",
        "legendshadow": "0",
        "legendborderalpha": "0",
        "palettecolors": "#f8bd19,#008ee4,#33bdda,#e44a00,#6baa01,#583e78",
        "showborder": "0"
    };
    $scope.ScreensCategories = [
        {
            "category": []
        }
    ];
    $scope.ScreensDataSet = [];

    $scope.MessagesStatisticsChartOptions = {
        "caption": "Number of times displayed",
        "plotgradientcolor": "",
        "bgcolor": "FFFFFF",
        "showalternatehgridcolor": "0",
        "divlinecolor": "CCCCCC",
        "showvalues": "0",
        "showcanvasborder": "0",
        "canvasborderalpha": "0",
        "canvasbordercolor": "CCCCCC",
        "canvasborderthickness": "1",
        "captionpadding": "30",
        "linethickness": "3",
        "legendshadow": "0",
        "legendborderalpha": "0",
        "palettecolors": "#f8bd19,#008ee4,#33bdda,#e44a00,#6baa01,#583e78",
        "showborder": "0"
    };
    $scope.MessagesCategories = [
        {
            "category": []
        }
    ];
    $scope.MessagesDataSet = [];

    ioFactory.emit('askMessages', '', function (result) { });
    ioFactory.on('getMessages', function (result) {
        if (result) {
            $scope.Messages = result;
        }
    });

    ioFactory.emit('askScreens', '', function (result) { });
    ioFactory.on('getScreens', function (result) {
        if (result) {
            $scope.Screens = result;
        }
    });

    ioFactory.emit('askMessagesStatistics', '', function (result) { });
    ioFactory.on('getMessagesStatistics', function (MessagesStatistics) {
        if (MessagesStatistics) {
            loadMessagesStatistics(MessagesStatistics, $scope);
        }
    });

    ioFactory.emit('askScreensStatistics', '', function (result) { });
    ioFactory.on('getScreensStatistics', function (ScreensStatistics) {
        if (ScreensStatistics) {
            loadScreensStatistics(ScreensStatistics, $scope);
        }
    });
});

var loadMessagesStatistics = function(MessagesStatistics, $scope){

    for (var index = 0; index < MessagesStatistics.length; index++ )
    {
        $scope.MessagesCategories[0].category[index] = {
            "label": MessagesStatistics[index]._id
        };
    }

    $scope.MessagesDataSet = [];
    for (var index = 0; index < $scope.Messages.length; index++ )
    {
        var messageData = getNumberOfTimesMessageDisplayed($scope.Messages[index].name, MessagesStatistics);

        $scope.MessagesDataSet[index] = {
            "seriesname": "Message "+$scope.Messages[index].name,
            "renderas": "Line",
            "data": messageData
        };
    }

};

var loadScreensStatistics = function(ScreensStatistics, $scope){

    for (var index = 0; index < ScreensStatistics.length; index++ )
    {
        $scope.ScreensCategories[0].category[index] = {
            "label": ScreensStatistics[index]._id
        };
    }

    $scope.ScreensDataSet = [];
    for (var index = 0; index < $scope.Screens.length; index++ )
    {
        var screenData = getMessagesDisplayedInScreen($scope.Screens[index].number, ScreensStatistics);

        $scope.ScreensDataSet[index] = {
            "seriesname": "Screen "+$scope.Screens[index].number.toString(),
            "renderas": "Line",
            "data": screenData
        };
    }

};

var getNumberOfTimesMessageDisplayed = function(messageName, messagesStatistics){
    var messageData = [];

    for (var index = 0; index < messagesStatistics.length; index++ ) {
        var timesDisplayed = 0;

        for (var index_2 = 0 ; index_2 <messagesStatistics[index].Messages.length; index_2++){
            if (messagesStatistics[index].Messages[index_2].Message == messageName){
                timesDisplayed = messagesStatistics[index].Messages[index_2].displayCount;
            }
        }
        messageData[index] = {
            "value": timesDisplayed.toString()
        };
    }

    return messageData;
};

var getMessagesDisplayedInScreen = function(screenNumber, screenStatistics){
    var screenData = [];

    for (var index = 0; index < screenStatistics.length; index++ ) {
        var messagesDisplayed = 0;

        for (var index_2 = 0 ; index_2 <screenStatistics[index].Screens.length; index_2++){
            if (screenStatistics[index].Screens[index_2].Screen == screenNumber){
                messagesDisplayed = screenStatistics[index].Screens[index_2].messagesDisplayed;
            }
        }
        screenData[index] = {
            "value": messagesDisplayed.toString()
        };
    }

    return screenData;
};
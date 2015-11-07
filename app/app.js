


var honeyqa = angular.module("honeyqa",[
    'ngRoute',
    'easypiechart'
]);



honeyqa.config(['$routeProvider', function($routeProvider) {


    $routeProvider
        .when("/project", {
            templateUrl: "plist/project.html",
            controller: "mainCtrl",
            title: "project"
        })
        .when("/add", {
            templateUrl: "plist/add.html",
            controller: "mainCtrl",
            title: "add"
        })
        .when("/t_android", {
            templateUrl: "plist/t_android.html",
            controller: "mainCtrl",
            title: "t_android"
        })
        .when("/t_ios", {
            templateUrl: "plist/t_ios.html",
            controller: "mainCtrl",
            title: "t_ios"
        })
        .when("/t_unity", {
            templateUrl: "plist/t_unity.html",
            controller: "mainCtrl",
            title: "t_unity"
        })
        .when("/t_tizen", {
            templateUrl: "plist/t_tizen.html",
            controller: "mainCtrl",
            title: "t_tizen"
        })
        .when("/t_cordova", {
            templateUrl: "plist/t_cordova.html",
            controller: "mainCtrl",
            title: "t_cordova"
        })
        .when("/overview", {
            templateUrl: "views/overview.html",
            controller : "mainCtrl",
            title : "overview",
            //resolve : resolve_js('endless_dashboard')
        })
        .when("/insight", {
            templateUrl: "views/insight.html",
            controller : "mainCtrl",
            title : "insight"
        })
        .when("/error_filter", {
            templateUrl: "views/error_filter.html",
            controller : "mainCtrl",
            title : "error_filter"
        })
        .when("/appver", {
            templateUrl: "views/appver.html",
            controller : "mainCtrl",
            title : "appver"
        })
        .when("/device", {
            templateUrl: "views/device.html",
            controller : "mainCtrl",
            title : "device"
        })
        .when("/sdk", {
            templateUrl: "views/sdk.html",
            controller : "mainCtrl",
            title : "sdk"
        })
        .when("/country", {
            templateUrl: "views/country.html",
            controller : "mainCtrl",
            title : "country"
        })
        .when("/class", {
            templateUrl: "views/class.html",
            controller : "mainCtrl",
            title : "class"
        })
        .when("/proguard",{
            templateUrl: "views/proguard.html",
            controller : "mainCtrl",
            title : "class"
        })
        .when("/dsym",{
            templateUrl: "views/dsym.html",
            controller : "mainCtrl",
            title : "class"
        })
        .otherwise({
            redirectTo:'/error-404'
        });



}]);

honeyqa.run(['$location', '$rootScope', function($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);

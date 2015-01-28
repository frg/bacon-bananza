'use strict';

// App Module: the name AngularStore matches the ng-app attribute in the main <html> tag
// the route provides parses the URL and injects the appropriate partial page
var storeApp = angular.module('AngularStore', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
        .when('/store/:category?', {
            templateUrl: 'app/partials/store.html',
            controller: storeController
        })
        .when('/products/:productSku', {
            templateUrl: 'app/partials/product.html',
            controller: storeController
        })
        .when('/cart', {
            templateUrl: 'app/partials/shopping-cart.html',
            controller: storeController
        })
        .otherwise({
            redirectTo: '/store'
        });
    }])
    .run(function ($rootScope) {
        $rootScope.loggedInUser = null;
    });
storeApp.factory("BaconFactory", ['$http', function ($http) {
    var factory = {};

    factory.getBacon = function () {
        return $http.get('bacon.json');
    };

    factory.getBaconCart = function (user) {
        return new shoppingCart(user);
    };

    //factory.myCart = new shoppingCart("AngularStore");

    return factory;
}]);
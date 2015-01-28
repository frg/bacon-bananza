function storeController($scope, $rootScope, $routeParams, BaconFactory) {
    //$scope.loggedInUser = new user("1@1", "1");
    $scope.store;
    $scope.categories;
    $scope.cart = getBaconCart();

    init();

    function init() {
        //console.log("init store");
        getStore($routeParams.category);
        getBaconCategories($routeParams.category);
        //getBaconCart();
    }

    $scope.getQuantityOfItemInCart = function (sku) {
        if ($scope.cart != null) {
            var items = $scope.cart.items;
            for (var i = 0; i < items.length; i++) {
                if (items[i].sku == sku) {
                    return items[i].quantity;
                }
            }
        }
        
        return 0;
    }

    $scope.getBaconStock = function (sku) {
        //function getBaconStock(sku){
        if ($scope.store != null && $scope.store != "undefined") {
            var jsonStock = $scope.store.getProduct(sku).stock;

            var jsonName = "checkouts";
            var checkouts = loadJson(jsonName);
            if (checkouts == null) {
                checkouts = [];
            }

            var stockBought = 0;
            for (var i = 0; i < checkouts.length; i++) {
                if (checkouts[i].sku == sku) {
                    stockBought += checkouts[i].quantity;
                }
            }

            return jsonStock - stockBought;
        }

        return -1;
    }

    loadJson = function (jsonName) {
        var json = localStorage != null ? localStorage[jsonName] : null;
        if (json != null && JSON != null) {
            try {
                json = JSON.parse(json);
                //console.log(json);
                return json;
            }
            catch (err) {
                // ignore errors while loading...
            }
        }

        return null;
    }

    function getBaconCategories(category) {
        var data = BaconFactory.getBacon();
        data.then(function (res) {
            var baconData = res.data;
            var baconCategories = [];

            //loop through bacon data array
            for (var i = 0; i < baconData.length; i++) {
                //if category is not already taken note of
                if (baconCategories.indexOf(baconData[i].category) == -1) {
                    baconCategories.push(baconData[i].category);
                }
            }

            //console.log(baconCategories);
            $scope.categories = baconCategories;
        });
    }

    function getStore(category) {
        var data = BaconFactory.getBacon();
        data.then(function (res) {
            var baconData = res.data;

            //if being filtered by category
            if ((category != 'undefined') && (category != null)) {
                //loop through bacon data array
                for (var i = 0; i < baconData.length; i++) {
                    //if bacon category does not match filter category
                    if (baconData[i].category.toLowerCase() != category.toLowerCase()) {
                        //remove element from array of bacon data
                        baconData.splice(i, 1);
                        //since element is removed we need to decrement
                        //to allow for next element to be reviewed
                        i--;
                    }
                }
            }

            //console.log(filteredBaconData);
            $scope.store = new store(baconData);

            // use routing to pick the selected product
            if ($routeParams.productSku != null) {
                //console.log("Clicked on this product");
                //console.log($routeParams.productSku);
                $scope.product = $scope.store.getProduct($routeParams.productSku);
                console.log($scope.product);
            }
        });
        //console.log($scope.store);
    }

    function getBaconCart(category) {
        //console.log($scope.loggedInUser);
        if ($scope.loggedInUser != null) {
            return BaconFactory.getBaconCart($rootScope.loggedInUser);
        }

        return null;
    }

    $scope.isLoggedIn = function () {
        //$rootScope.loggedInUser = new user("1@!", "1");
        //console.log($rootScope.loggedInUser);
        if ($rootScope.loggedInUser != null) {
            //console.log("A user is logged in!");
            //console.log($rootScope.loggedInUser);
            return true;
        }

        //console.log("NO user is logged in!");
        return false;
    }
}
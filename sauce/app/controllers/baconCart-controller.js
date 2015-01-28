function shoppingCart(user) {
    this.user = user;
    //console.log(this.user);
    this.cartName = "bacon_cart";
    this.clearCart = false;
    this.items = [];

    // load items from local storage when initializing
    this.loadItems();

    // save items to local storage when unloading
    var self = this;
    $(window).unload(function () {
        if (self.clearCart) {
            self.clearItems();
        }
        self.saveItems();
        self.clearCart = false;
    });

    //this.quantityOfItem = function (sku) {
    //    console.log("sup nigs!");
    //    for (var i = 0; i < items.length; i++) {
    //        console.log(item[i]);
    //        if (items[i].sku == sku) {
    //            console.log(items[i].quantity);
    //            return items[i].quantity;
    //        }
    //    }

    //    return 0;
    //}
}

// load items from local storage
shoppingCart.prototype.loadItems = function (user) {
    var localBaconCart = loadJson(this.cartName);
    //console.log("Got this cart data from local storage");
    //console.log(localBaconCart);

    if (localBaconCart != null) {
        var items = localBaconCart[this.user.email];
        //console.log("Got this user cart data from local storage");
        //console.log(items);

        if (items != null) {
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.sku != null && item.name != null && item.price != null && item.quantity != null) {
                    item = new cartItem(item.sku, item.name, item.price, item.quantity);
                    this.items.push(item);
                }
            }

            //console.log("Loaded these items");
            //console.log(this.items);
        }
    }
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

// save items to local storage
shoppingCart.prototype.saveItems = function () {
    if (localStorage != null && JSON != null) {
        //try get local cart data
        var localBaconCart = loadJson(this.cartName);
        //console.log("Got this cart data from local storage.");
        //console.log(localBaconCart);

        //if no local cart data is found
        if (localBaconCart == null) {
            //console.log("No local cart data found.");
            //init cart data json arr
            localBaconCart = {};
        }

        //add new cart data to var
        localBaconCart[this.user.email] = this.items;
        //console.log("Writing this cart data to local storage");
        //console.log(localBaconCart);
        //save local cart data to local storage
        saveJson(this.cartName, localBaconCart);
    }
}

saveJson = function (jsonName, json) {
    if (localStorage != null && JSON != null) {
        localStorage[jsonName] = JSON.stringify(json);
    }
}

// adds an item to the cart
shoppingCart.prototype.addItem = function (sku, name, price, quantity, stock) {
    quantity = this.toNumber(quantity);

    if (quantity != 0) {
        // update quantity for existing item
        var found = false;
        for (var i = 0; i < this.items.length && !found; i++) {
            var item = this.items[i];
            if (item.sku == sku) {
                found = true;
                item.quantity = this.toNumber(item.quantity + quantity);

                if (item.quantity <= 0) {
                    this.items.splice(i, 1);
                }
            }
        }

        // new item, add now
        if (!found) {
            var item = new cartItem(sku, name, price, quantity);
            this.items.push(item);
        }

        // save changes
        this.saveItems();
    }
}

// get the total price for all items currently in the cart
shoppingCart.prototype.getTotalPrice = function (sku) {
    var total = 0;
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        if (sku == null || item.sku == sku) {
            total += this.toNumber(item.quantity * item.price);
        }
    }
    return total;
}

// get the total count for all items currently in the cart
shoppingCart.prototype.getTotalCount = function (sku) {
    var count = 0;
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        if (sku == null || item.sku == sku) {
            count += this.toNumber(item.quantity);
        }
    }
    return count;
}

//checkout
shoppingCart.prototype.checkout = function () {
    var jsonName = "checkouts";
    console.log("Checking out!");

    //fetch current checkouts
    var json = loadJson(jsonName);
    if (json == null) {
        json = [];
    }
    //fetch current cart items
    var currentCartItems = this.items;
    //add each current cart item to list of checked out items
    for (var i = 0; i < currentCartItems.length; i++) {
        json.push(currentCartItems[i]);
    }
    //save json
    saveJson(jsonName, json);

    //clear items
    this.items = [];
    this.saveItems();
}

// clear the cart
shoppingCart.prototype.clearItems = function () {
    this.items = [];
    this.saveItems();
}

shoppingCart.prototype.toNumber = function (value) {
    value = value * 1;
    return isNaN(value) ? 0 : value;
}

//----------------------------------------------------------------
// items in the cart
//
function cartItem(sku, name, price, quantity) {
    this.sku = sku;
    this.name = name;
    this.price = price * 1;
    this.quantity = quantity * 1;
}


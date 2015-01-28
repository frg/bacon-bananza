storeApp.controller('LoginController', function ($scope, $rootScope) {
    //console.log($rootScope.loggedInUser);

    $scope.signin = function () {
        if ($scope.login_form.$valid){
            if (validateUser(new user($scope.email, $scope.password))) {
                $rootScope.loggedInUser = new user($scope.email, $scope.password);
                window.location.replace('#');
                //console.log($rootScope.loggedInUser);
                $scope.login_form.good_login = true;
                return;
            }
        }

        $scope.login_form.good_login = false;
    };

    $scope.signout = function () {
        $rootScope.loggedInUser = null;
        window.location.replace('#');
        //$scope.login_form.good_login = true;
    };

    $scope.register = function () {
        if ($scope.login_form.$valid) {
            if (registerUser(new user($scope.email, $scope.password))) {
                $rootScope.loggedInUser = new user($scope.email, $scope.password);
                window.location.replace('#');
                $scope.login_form.good_login = true;
                return;
            }
        }

        $scope.login_form.good_login = false;
    };
});

validateUser = function (user) {
    var users = loadJson("reg_users");
    //console.log(users);

    if (users != null) {
        if (users.length > 0) {
            for (var i = 0; i < users.length; i++) {
                var valid = comapreUser(user, users[i]);
                //console.log(valid);

                //if email and password match
                if (valid == 2) {
                    return true;
                }
            }
        }
    }
    
    return false;
}

registerUser = function (user) {
    var users = loadJson("reg_users");

    if (users != null) {
        //if user (email) does not exist
        if (!userExists(user)) {
            users.push(user);
            saveJson("reg_users", users);
            return true;
        }
    } else { // if no local storage is found
        //create new user
        var users = [];
        users.push(user);
        saveJson("reg_users", users);

        return true;
    }

    return false;
}

//if email exists in local storage
userExists = function (user) {
    var users = loadJson("reg_users");

    if (users != null) {
        if (users.length > 0) {
            for (var i = 0; i < users.length; i++) {
                var valid = comapreUser(user, users[i]);

                //if emails match
                //or if password match
                if (valid == 1 || valid == 2) {
                    //console.log("user match: " + valid);
                    return true;
                }
            }
        }
    }

    return false;
}

createUsersJson = function () {
    saveJson("reg_users", []);
}

saveJson = function (jsonName, json) {
    if (localStorage != null && JSON != null) {
        localStorage[jsonName] = JSON.stringify(json);
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

function user(email, password) {
    this.email = email;
    this.password = password;
}

//returns -1 if users not identicle
//returns 1 if email is equal
//returns 2 id email and password are equal
function comapreUser(compareUser, withUser) {
    if (compareUser.email == withUser.email) {
        if (compareUser.password == withUser.password) {
            return 2;
        }
        return 1;
    }
    return -1
}
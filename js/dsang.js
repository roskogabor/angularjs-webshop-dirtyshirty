angular.module('app', ['ngCookies'])
.controller('siteController', siteController);

function siteController($scope, $window, $cookies, $http, $location) {
  $scope.username = 'guest';
  $scope.orderselector = 'id';
  $scope.filterselector = '';
  $http.get('data.json').then(function(response) {
    $scope.menus = response.data.menu;
    $scope.footers = response.data.footers;
    $scope.items = response.data.items;
  });
  if($scope.username != 'guest') {
    $scope.loginButton = 'LOGOUT';
  } else {
    $scope.loginButton = 'LOGIN';
  }
  $scope.wishList = [];
  $scope.cart = [];
	$scope.cookies = $cookies.get('wishlist');
	$scope.allPrice = 0;
	$scope.message = $scope.username + ', you have this item(s) in your wish list';
	if($scope.cookies != '' && $scope.cookies != '[]') {
		angular.forEach($scope.cookies, function(value) {
			angular.forEach($scope.items, function(key) {
				if (value == key.id) {
					$scope.wishList.push({id: value, price: key.price, name: key.name});
					$scope.allPrice += parseInt(key.price);
				}
			});
		});
	}
  $scope.name = 'there is no item';
  $scope.imageClass = 'normal';
  $scope.imageIcon = 'plus';
  $scope.price = '-';
  $scope.category = '-';
  $scope.description = 'there is no item with this id';

  $scope.Login = function () {
    if($scope.username != 'guest') {
      alert('you logged out');
      $cookies.put("username", 'guest');
      $scope.loginButton = 'LOGIN';
    } else {
      $scope.username = prompt('username');
      alert($scope.username + ' logged in');
      $cookies.put('username', $scope.username);
      $scope.loginButton = 'LOGOUT';
    }
  };

	$scope.RemoveItem = function (item, price) {
		$scope.allPrice -= parseInt(price);
		$scope.cart.splice(item, 1);
		$scope.cartIds = [];
		console.log($scope.cart);
		angular.forEach($scope.cart, function(value) {
			$scope.cartIds.push(value.id);
		});
		$cookies.put('cart', $scope.cartIds);
	};

  if ($location.absUrl().includes("?")) {
    angular.forEach($scope.items, function(value, key){
      if(value.id == $location.absUrl().split("?")[1].split("=")[1]) {
  		  $scope.id = value.id;
  		  $scope.name = value.name;
  		  $scope.price = value.price;
  		  $scope.category = value.category;
  		  $scope.description = value.description;
  		  $scope.image = value.image;
  	  }
    });
  }

  $scope.AddToCart = function () {
  	$scope.cookies = $cookies.get('cart');
  	if($scope.cookies != '' && $scope.cookies != '[]') {
  		angular.forEach($scope.cookies, function(value) {
  			if (value != ',') $scope.cart.push(value);
  		});
  	}
  	$scope.cart.push($scope.id);
  	$cookies.put('cart', $scope.cart);
  };

  $scope.AddToWishList = function () {
    /*$scope.cookies = $cookies.get('wishlist');
    if($scope.cookies != '' && $scope.cookies != '[]') {
      angular.forEach($scope.cookies, function(value) {
        if (value != ',') $scope.wishList.push(value);
      });
    }*/
    $scope.wishList.push($scope.id);
    $cookies.put('wishlist', $scope.wishList);
  };

  $scope.Zoom = function () {
    if ($scope.imageClass != 'normal') {
  		$scope.imageClass = 'normal';
  		$scope.imageIcon = 'plus';
  	} else {
  		$scope.imageClass = 'zoom';
  		$scope.imageIcon = 'minus';
  	}
  };
}

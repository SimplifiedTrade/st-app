( function( ng, undefined ) {

	var module = angular.module( "app.simplifiedtrade", [
		"STrade",
		"ionic",
		"starter.controllers",
		"ngCordova"
	]);

	module.config( function( $stateProvider, $urlRouterProvider ) {
		$stateProvider
			.state( "app", {
				url: "/app",
				abstract: true,
				templateUrl: "templates/menu.html",
				controller: "AppCtrl"
			})
		
		
		

			.state( "app.home", {
				url: "/home",
				views: {
					"menuContent": {
						templateUrl: "templates/home.html"
					}
				}
			})		
			.state( "app.search", {
				url: "/search",
				views: {
					"menuContent": {
						templateUrl: "templates/search.html"
					}
				}
			})
			.state( "app.takePic", {
				url: "/take-pic",
				views: {
					"menuContent": {
						templateUrl: "templates/take-pic.html",
						controller: "TakePicCtrl"
					}
				}
			})
			.state( "app.location", {
				url: "/location",
				views: {
					"menuContent": {
						templateUrl: "templates/location.html",
						controller: "LocationCtrl"
					}
				}
			})
			.state( "app.placementType", {
				url: "/placement-type",
				views: {
					"menuContent": {
						templateUrl: "templates/placement-type.html",
						controller: "PlacementTypeCtrl"
					}
				}
			})
			.state( "app.placementOpts", {
				url: "/placement-opts/:type",
				views: {
					"menuContent": {
						templateUrl: "templates/placement-opts.html",
						controller: "PlacementOptsCtrl"
					}
				}
			})
			.state( "app.dept", {
				url: "/dept",
				views: {
					"menuContent": {
						templateUrl: "templates/dept.html",
						controller: "DeptCtrl"
					}
				}
			})
			.state( "app.placementPosition", {
				url: "/placement-position",
				views: {
					"menuContent": {
						templateUrl: "templates/placement-position.html",
						controller: "PlacementPositionCtrl"
					}
				}
			})
			.state( "app.postMortem", {
				url: "/post-mortem",
				views: {
					"menuContent": {
						templateUrl: "templates/post-mortem.html",
						controller: "PostMortemCtrl"
					}
				}
			})
			.state( "app.summary", {
				url: "/summary",
				views: {
					"menuContent": {
						templateUrl: "templates/summary.html",
						controller: "SummaryCtrl"
					}
				}
			});
		
		
		$urlRouterProvider.otherwise( "/app/home" );
	});

	module.run( function( $window, $rootScope, $ionicPlatform, $state, $stateParams ) {
		var win = $window;
	
		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;

		$ionicPlatform.ready( function() {
			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			// for form inputs)

			if ( win.cordova && win.cordova.plugins.Keyboard ) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar( true );
				cordova.plugins.Keyboard.disableScroll( true );
			}

			if ( win.StatusBar ) {
				// org.apache.cordova.statusbar required
				StatusBar.styleDefault();
			}

		});
	});

})( angular );
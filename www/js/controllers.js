( function( ng, undefined ) {

	var module = angular.module( "starter.controllers", [
		"STrade",
		"strade.global.services",
		"strade.global.filters",
		"ngCordova.plugins.badge",
		"ngCordova.plugins.camera"
	]);

	module.controller( "AppCtrl", function( $scope, $rootScope, $ionicModal, $timeout ) {

		// With the new view caching in Ionic, Controllers are only called
		// when they are recreated or on app start, instead of every page change.
		// To listen for when this page is active (for example, to refresh data),
		// listen for the $ionicView.enter event:
		//$scope.$on('$ionicView.enter', function(e) {
		//});

		// Form data for the login modal
		$scope.loginData = {};

		// Create the login modal that we will use later
		$ionicModal.fromTemplateUrl( "templates/login.html", { scope: $scope } ).then( function( modal ) {
			$scope.modal = modal;
		});

		// Triggered in the login modal to close it
		$scope.closeLogin = function() {
			$scope.modal.hide();
		};

		// Open the login modal
		$scope.login = function() {
			$scope.modal.show();
		};

		// Perform the login action when the user submits the login form
		$scope.doLogin = function() {
			console.log( "Doing login", $scope.loginData );

			// Simulate a login delay. Remove this and replace with your login
			// code if using a login system
			$timeout( function() {
				$scope.closeLogin();
			}, 1000 );
		};
	});



	module.controller( "TakePicCtrl", function( $scope, $cordovaCamera ) {

		var options = {
			quality: 50,
			destinationType: Camera.DestinationType.DATA_URL,
			sourceType: Camera.PictureSourceType.CAMERA,
			allowEdit: false,
			encodingType: Camera.EncodingType.JPEG,
			// targetWidth: 200,
			// targetHeight: 200,
			popoverOptions: CameraPopoverOptions,
			// saveToPhotoAlbum: false,
			correctOrientation:true
		};
	
		$scope.takePic = function() {
			$cordovaCamera.getPicture( options ).then( function( imageData ) {
				$scope.picCaptured = "data:image/jpeg;base64," + imageData;
			}, function( err ) {
				// error
			
				console.info( "IMAGE CAPTURE ERROR: ", err );
			
			});
		};

	});


	module.controller( "LocationCtrl", function( $scope, $state ) {

		$scope.selectLocation = function( loc ) {

			console.info( "ITEM SELECTED: ", loc );
		
			$state.go( "app.placementType", { location: loc } );
		};

	});

	module.controller( "PlacementTypeCtrl", function( $scope, $state ) {

		$scope.selectPlacement = function( type ) {
			$state.go( "app.placementOpts", { type: type } );
		};

	});

	module.controller( "PlacementOptsCtrl", function( $scope, $state, $stateParams, lodash ) {

		ng.extend( $scope, {
			placementType: $stateParams.type
		});


		$scope.selectDept = function() {
			$state.go( "app.dept" );
		};

	});
	
	module.controller( "DeptCtrl", function( $scope, $state, $stateParams, lodash ) {

		$scope.placementType = ( $stateParams.type );


		$scope.selectDept = function( dept ) {
			$state.go( "app.placementPosition" );
		};

	});
	
	module.controller( "PlacementPositionCtrl", function( $scope, $state ) {
		

		$scope.selectPlacementPos = function( type ) {
			$state.go( "app.postMortem" );
		};

	});
		
	module.controller( "PostMortemCtrl", function( $scope, $state ) {
		


	});
	
	
	
	
	


})( angular );








// module.controller( "PlaylistCtrl", function( $scope, $stateParams, $cordovaBadge ) {
//
// 	// $cordovaBadge.set(3).then(function() {
// 	// 	// You have permission, badge set.
// 	// }, function(err) {
// 	// 	// You do not have permission.
// 	// });
//
//
// 	// document.addEventListener( "deviceready", function() {
// 	// 	console.info( "DEVICE READY" );
// 	// 	window.cordova.plugins.notification.badge.set( 10 );
// 	// }, false );
//
// });

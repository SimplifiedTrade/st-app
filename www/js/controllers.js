( function( ng, undefined ) {

	var module = angular.module( "starter.controllers", [
		"STrade",
		"strade.global.services",
		"strade.global.filters",
		"ngCordova.plugins.badge",
		"ngCordova.plugins.camera",
		"ngCordova.plugins.file",
		"ngCordova.plugins.fileTransfer",
		"ngCordova.plugins.barcodeScanner"
	]);

	module.config( function( $compileProvider ) {
		$compileProvider.imgSrcSanitizationWhitelist( /^\s*(https?|ftp|mailto|file|tel|blob):|data:image\// );
	});
		
	module.run( function( $window, $rootScope, $ionicPlatform, $state, $stateParams, lodash, stUtils ) {
		var win = $window,
			dataModelPristine = {
				Case: {
					id: null,
					photoBase64: null,
					photo: {
						uri: null,
						path: null,
						file: null,
						ext: null
					},					
					location: null,
					placement: {
						lifecycle: null,
						type: null,
						options: null,
						position: null
					},
					barcodeScan: {},
					meta: {
						caseCondition: null,
						brand: null,
						conditionTypes: null,
						fixed: null,
						time: null,
						missing: null,
						store: null,
						space: null,
						other: null
					}
				}
			};
			
		
		$rootScope.dataModel = {};
		
		$rootScope.resetDataModel = function() {
			var id = stUtils.uuid();
			$rootScope.dataModel = lodash.merge( dataModelPristine, { Case: { id: id } } );
		};

		$rootScope.resetDataModel();
		
	});
	
	module.controller( "AppCtrl", function( $scope, $rootScope, $ionicModal, $timeout, Data ) {

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
		
		
		
		// !!!!!! DEBUG !!!!!!!!!!!!!
		$scope.doS3Auth = function() {
			var fileObj = {
					uri: "file:///data/data/com.ionicframework.app822945/files/e0b4b5f5-752c-45b0-9c81-7b3b102c838e.jpg",
					path: "file:///data/data/com.ionicframework.app822945/files/",
					file: "e0b4b5f5-752c-45b0-9c81-7b3b102c838e.jpg",
					ext: "jpg"
				},
				// filePart = fileObj.file.substr( 0, fileObj.file.lastIndexOf( "." ) ) || fileObj.file;
				path = "_NEW/" + fileObj.file;
			
			
			console.info( "doS3Auth CLICKED: ", path );
			
			Data.Case.saveImg( path, fileObj.uri );
		};
	});

	module.controller( "NewCaseCtrl", function( $scope, $rootScope, $state ) {
		
		
		$scope.$on( "$ionicView.enter", function( e ) {
			
			// Clear out the model
			$rootScope.resetDataModel();
			
			console.warn( "+++ ENTER: ", $rootScope.dataModel );
		});

		$scope.startNewCase = function() {
			$state.go( "app.location" );
		};

	});
	
	module.controller( "LocationCtrl", function( $scope, $rootScope, $state, $cordovaGeolocation, $ionicLoading ) {

		var posOptions = {
				timeout: 10000,
				enableHighAccuracy: false
			};

		$scope.data = {
			location: $rootScope.dataModel.Case.location
		};

		ng.extend( $scope, {
			coords: {},
			coordsLoading: true,
			getLoc: function() {
				return $cordovaGeolocation.getCurrentPosition( posOptions );
			},
			selectLocation: function( loc ) {

				console.info( "ITEM SELECTED: ", loc );
				$scope.data.location = loc;

				$state.go( "app.takePic" );
			}
		});


		$scope.getLoc().then( function( position ) {
			var lat = position.coords.latitude,
				long = position.coords.longitude;
		
			$scope.coords = {
				lat: lat,
				long: long
			};
		
			console.info( "COORDS: ", lat, long );
		
		}, function( err ) {
			// error
			console.info( "COORDS: ERROR: ", err.message );
		
			$scope.coords = null;
		}).finally( function() {
			
			$scope.coordsLoading = false;
		});


		/*
		$scope.startWatchLocation = function() {
			var watchOptions = {
					timeout: 3000,
					enableHighAccuracy: false // may cause errors if true
				},
				watch = $cordovaGeolocation.watchPosition( watchOptions ),
				lat, long;

			watch.then( null, function( err ) {
				// error

			}, function( position ) {
				lat = position.coords.latitude;
				long = position.coords.longitude;

				console.info( "2 LAT/LONG: ", lat, long );
			});

			// watch.clearWatch();
		};
		*/
	});
	
	module.controller( "TakePicCtrl", function( $scope, $rootScope, $state, $cordovaCamera, $window, $cordovaFile, stUtils, lodash ) {

		var options = {},
			hasCamera = !!$window.Camera;
			
		$scope.data = {
			photoBase64: $rootScope.dataModel.Case.photoBase64
		};
		
		$scope.urlForImage = function() {
			
		};

		if ( hasCamera ) {
			options = {
				quality: 50,
				sourceType: Camera.PictureSourceType.CAMERA,
				// destinationType: Camera.DestinationType.DATA_URL,
				destinationType: Camera.DestinationType.FILE_URI,
				
				allowEdit: false,
				encodingType: Camera.EncodingType.JPEG,
				// targetWidth: 200,
				// targetHeight: 200,
				popoverOptions: CameraPopoverOptions,
				// saveToPhotoAlbum: false,
				correctOrientation:true
			};
		}

		$scope.takePic = function() {
			$cordovaCamera.getPicture( options ).then( function( imageData ) {
		        var id = lodash.get( $rootScope, "dataModel.Case.id" ),
					fileName = imageData.substr( imageData.lastIndexOf( "/" ) + 1 ),
					filePath = imageData.substr( 0, imageData.lastIndexOf( "/" ) + 1 ),
					fileExt = fileName.replace( /^.*\./, "" ),
					fileNewName = ( id ) ? id + "." + fileExt : fileName;
					
				console.info( [ fileName, filePath, fileExt, fileNewName ].join( "\n" ) );
				
				$cordovaFile.moveFile( filePath, fileName, cordova.file.dataDirectory, fileNewName ).then( function( info ) {

					$rootScope.dataModel.Case.photo = {
						uri: info.toURL(),
						path: cordova.file.dataDirectory,
						file: fileNewName,
						ext: fileExt
					};

					if ( !stUtils.isLiveReload ) {
						// Normal case, webview can read from "file:///"
						$scope.data.photoUri = info.toURL();
					} else {
						// return a b46 image URI: only needed during DEV, using livereload
						$cordovaFile.readAsDataURL( cordova.file.dataDirectory, fileNewName ).then( function( dataUri ) {
							console.info( arguments );
							if ( !lodash.isEmpty( dataUri ) ) {
								$scope.data.photoUri = dataUri;
							} else {
								// show placeholder image
							}
						});
					}
					// console.info( "SETTING SRC: ", $scope.data.photoUri );
				}, function( e ) {
					console.info( "FILE ERROR: ", e );
				});				
			}, function( err ) {
				// error
				console.info( "IMAGE CAPTURE ERROR: ", err );

			});
		};
		
		$scope.savePic = function() {
			
			$state.go( "app.placementType" );
		};

	});

	module.controller( "PlacementTypeCtrl", function( $scope, $rootScope, $state ) {

		$scope.data = {
			placement: $rootScope.dataModel.Case.placement
		};

		$scope.savePlacement = function() {
			$state.go( "app.placementOpts", { type: $rootScope.dataModel.Case.placement.type } );
		};

	});

	module.controller( "PlacementOptsCtrl", function( $scope, $rootScope, $state, $stateParams, lodash ) {

		$scope.data = {
			placement: $rootScope.dataModel.Case.placement
		};

		ng.extend( $scope, {
			placementType: $stateParams.type
		});


		$scope.selectDept = function() {
			$state.go( "app.placementPosition" );
		};

	});

	module.controller( "DeptCtrl", function( $scope, $rootScope, $state, $stateParams, lodash ) {

		$scope.placementType = ( $stateParams.type );


		$scope.selectDept = function( dept ) {
			$state.go( "app.placementPosition" );
		};

	});

	module.controller( "PlacementPositionCtrl", function( $scope, $rootScope, $state ) {


		$scope.selectPlacementPos = function( type ) {
			
			$rootScope.dataModel.Case.placement.position = type;
			
			$state.go( "app.scanBarcode" );
		};

	});
	
	module.controller( "ScanBarcodeCtrl", function( $scope, $rootScope, $state, $cordovaBarcodeScanner ) {
		
		
		$scope.data = {
			barcodeScan: $rootScope.dataModel.Case.barcodeScan
		};

		console.info( "$cordovaBarcodeScanner: ", JSON.stringify( $cordovaBarcodeScanner ) );
		
		$scope.doScan = function() {
			
			$cordovaBarcodeScanner.scan().then( function( scanData ) {
				if ( !scanData.cancelled ) {
					$scope.barcodeScanned = true;
					
					$rootScope.dataModel.Case.barcodeScan = $scope.data.barcodeScan = scanData;
					
					console.info( "imageData: ", JSON.stringify( scanData ) );
					
				} else {
					// Scan Cancelled
					
					
				}
				
				
			}, function( err ) {


			}).finally( function() {
				$scope.barcodeCaptured = false;
				
			});
			
		};
		
		$scope.skipBarcode = function() {
			$state.go( "app.caseMeta" );
		};

		$scope.saveBarcode = function( type ) {
			$state.go( "app.caseMeta" );
		};
	});
	
	module.controller( "CaseMetaCtrl", function( $scope, $rootScope, $state ) {
				
		$scope.data = {
			placement: $rootScope.dataModel.Case.placement,
			meta: $rootScope.dataModel.Case.meta
		};
		
		
		// DEBUG!!!!!
		// $scope.data.placement.type = "shelf";
		
		

		$scope.savePostMortem = function( type ) {
			$state.go( "app.summary" );
		};
	});

	module.controller( "SummaryCtrl", function( $scope, $rootScope, $state, Data ) {
		
		
		var summary = ng.copy( $rootScope.dataModel.Case );
		
		//summary.photoBase64 = String( summary.photoBase64 ).substring( 0, 10 ).concat( "..." ).replace( "null", "" );
		
		$scope.data = {
			summary: summary
		}
		
		$scope.saveAll = function() {
			
			Data.save( summary ).then( function( resp ) {
				
				//console.info( "Data.save: ", JSON.stringify( resp, null, 4 ) );
				
				$state.go( "app.home" );
			});
			
			
		};
		
		$scope.saveAndRestart = function() {
			// DEBUG: Disabled for web debugging.
			// $state.go( "app.takePic" );
			$state.go( "app.location" );
		};

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

( function( ng, undefined ) {
	
	var module = ng.module( "strade.global.services", [
	]);
	
	
	/**
	* Service Lodash Wrapper
	*
	*/
	module.factory( "lodash", [ "$window", function( $window ) {
		if ( $window && $window._ ) {
			return $window._;
		} else {
			throw new Error( "Js library 'Lo-Dash' is not available! Please make sure it has been added to the page." );
		}	
	}]);
	
	/**
	* Service Utils
	*
	*/
	module.factory( "stUtils", [ "$window", function( $window ) {
		var win = $window,
			doc = win.document,
			isLR = ( !!win.LiveReload );
		
		return {
			isLiveReload: isLR,
			uuid: function() {
				return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace( /[xy]/g, function( c ) {
					var r = crypto.getRandomValues( new Uint8Array( 1 ) )[ 0 ] % 16 | 0, v = c == "x" ? r : ( r&0x3|0x8 );
					return v.toString( 16 );
				});
			}
		};
	}]);
		
	/**
	* Service Main Data
	*
	*/
	module.factory( "Data", [ "$window", "$q", "$timeout", "$http", "$cordovaFileTransfer", function( $window, $q, $timeout, $http, $cordovaFileTransfer ) {
		
		// var url = "https://w6d5v9l2pi.execute-api.us-east-1.amazonaws.com/dev/case";
		var config = {
				headers: {
					"x-api-key": "Ox20tJjYpk177MKjMpoyz7Ka3m960Xzj6x2FLUsK"
				}
			},
			getS3Sig = function( fileName ) {
				var url = "/auth/aws/s3";				
				return $http.post( url, { fileName: fileName }, config );
			},
			saveData = function( data ) {
				var id = data.id,
					url = "/cases/" + id,
					postObj = {
						caseId: id,
						payload: data				
					};
			
				console.info( "SAVE CALLED...", id, data );
			
				return $http.post( url, postObj, config ).then( function( resp ) {
				
					console.info( "API GATEWAY CALL: ", resp );
				
					return resp;
				});
			},
			saveImg = function( fileName, imageURI ) {
				fileName = "_NEW/" + fileName;
				
				return getS3Sig( fileName ).then( function( resp ) {
					var data = resp.data,
						s3Url = "https://" + data.bucket + ".s3.amazonaws.com/",
						cFileTransfer;
						
					// console.info( "S3 AUTH: ", data );
					// return;
					
		            var optsUpld = {
			            fileKey: "file",
			            fileName: data.fileName,
			            mimeType: "image/jpeg",
			            chunkedMode: false,
			            headers: {
			                connection: "close"
			            },
			            params: {
			                key: data.fileName,
			                AWSAccessKeyId: data.awsKey,
			                acl: "private",
			                policy: data.policy,
			                signature: data.signature,
			                "Content-Type": "image/jpeg"
			            }
		            };

					cFileTransfer = $cordovaFileTransfer.upload( s3Url , imageURI, optsUpld ).then( function( result ) {
						
						console.info( "UPLOAD SUCCESS: ", result );
						return result;
					}, function( err ) {
						
						console.error( "UPLOAD ERROR: ", err );
						return err;
					}, function( progress ) {
						
						console.info( "PROGRESS: ", progress )
						return progress;
					});
					
					return cFileTransfer;
				});
			},
			search = function( params ) {
				var url = "/search";
					// params = {
					// 	q: term
					// };


				return $http.get( url, ng.extend( {}, config, { params: params } ) ).then( function( resp ) {
					var obj, output;
				
					console.info( "API GATEWAY CALL: ", resp );
					
					if ( resp.status === 200 && resp.data ) {
						
						try {
							obj = JSON.parse( resp.data );
							output = obj.hits.hits;
						} catch ( ex ) {}
					}
					
					return output;
				});
			};

		return {
			
			Case: {
				save: function( data ) {
					
					// DEBUG ***
					// return $q.resolve();
					
					return $q( function( resolve, reject ) {
						
						console.info( "DATA: ", data );
						
						var s3Path = data.photo.file,
							promises = [
								saveImg( s3Path, data.photo.uri ),
								saveData( data )
							];

						return $q.all( promises ).then( resolve, reject );
						// return $timeout( resolve, 2000 );
					});
				},
				saveData: saveData,
				saveImg: saveImg,
				search: search
			}
		};
		
		
	}]);
	

})( angular );


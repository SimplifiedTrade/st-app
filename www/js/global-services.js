( function( ng, undefined ) {
	
	var module = ng.module( "strade.global.services", [ ] );

	/**
	* Lodash Service
	*
	*/
	module.factory( "lodash", [ "$window", function( $window ) {
		if ( $window && $window._ ) {
			return $window._;
		} else {
			throw new Error( "Js library 'Lo-Dash' is not available! Please make sure it has been added to the page." );
		}
	}]);
	

})( angular );



